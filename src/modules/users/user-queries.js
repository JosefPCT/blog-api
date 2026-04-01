const prisma = require("../../config/prisma.js");

// CREATE

// Create user in the User model, email is a required value, other values has default values
module.exports.createNewUser = async (
  email,
  firstName = "Test",
  lastName = "User",
  hash = "hashplaceholderax123",
  isAuthor = false,
  isAdmin = false,
) => {
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      hash,
      isAuthor,
      isAdmin
    },
  });
  return user;
};

// READ

// Returns all users in the User Model
// Accepts optional arguments to specify which users to show
// argument names corresponds to column names
// Values can be string or boolean for certain columns
// Optional arguments are:
// email, firstName, lastName, isAuthor, isAdmin, numberOfPosts, numberOfComments
module.exports.fetchAllUsers = async (optionalArgs, sortObj) => {

  // Define arrays outside the if blocks for scoping
  let userIdsForPost = []; 
  let userIdsForComments = [];

  // When numberOfPosts is not equals to zero
  // Queries to the Post model to get all users/authors that has a post and group them by author
  // Using the data, filter out depending on the value of the inputted value in numberOfPosts, then filters out the data to only get the authorId(the user's `id`)
  // User ids will  be used in the findMany query on the `id` field in the `in` 
  // Dynamic pagination that takes 5 records by page, depending on the optional page query parameter
  // Dynamic sorting depending on the optional sort query parameter with (+(%2b) or -) symbols (sort object created in the service layer)
  if(optionalArgs.numberOfPosts && parseInt(optionalArgs.numberOfPosts) !== 0){
    const usersWithPostCount = await prisma.post.groupBy({
      by: ['authorId'],
      _count: {
        id: true,
      },
    });

    const filteredUsers = usersWithPostCount.filter(userGrp => userGrp._count.id >= optionalArgs.numberOfPosts);
    userIdsForPost = filteredUsers.map(post => post.authorId);
  } 
  
  // Same logic as the above function but with comments
  if(optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0){
    const usersWithCommentCount = await prisma.comment.groupBy({
      by: ['commenterId'],
      _count: {
        id: true,
      }
    });

    const filteredUsers = usersWithCommentCount.filter(userGrp => userGrp._count.id >= optionalArgs.numberOfComments);
    userIdsForComments = filteredUsers.map(comment => comment.commenterId);
  }

  // Combine user ids posts + comments
  const userIds = [...userIdsForPost, ...userIdsForComments];

  // Separated object to use in the WHERE clause when req.query.mode is not defined or explicitly defined as AND
  const whereObj = {
      email: optionalArgs.email ? { contains: optionalArgs.email } : undefined,
      firstName: optionalArgs.firstName ? {  contains: optionalArgs.firstName } : undefined,
      lastName:  optionalArgs.lastName ?  { contains: optionalArgs.lastName } : undefined,
      isAuthor: optionalArgs.isAuthor ? ( optionalArgs.isAuthor === 'true' ? true : false ) : undefined,
      isAdmin: optionalArgs.isAdmin ? ( optionalArgs.isAdmin === 'true' ? true : false ) : undefined,
      posts: optionalArgs.numberOfPosts && parseInt(optionalArgs.numberOfPosts) === 0 ? { none: {}} : undefined,
      comments: optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) === 0 ? { none: {}} : undefined,
      id: (optionalArgs.numberOfPosts && parseInt(optionalArgs.numberOfPosts) !== 0) || (optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0) ? { in: userIds } : undefined,
  }

  // Array containing objects to use in the WHERE clause when req.query.mode is either OR or NOT
  const OrWhereArrObj = Array.from(Object.keys(whereObj), (key) => ({ [key]: whereObj[key]}));
  console.log(OrWhereArrObj);

  // Main query will return the resulting data
  return await prisma.user.findMany({
    take: optionalArgs.page ? 5 : undefined,
    skip: optionalArgs.page ? (((optionalArgs.page) - 1) * 5) : undefined,
    where: {
      AND: optionalArgs.mode === 'and' || optionalArgs.mode === undefined  ? whereObj : undefined,
      NOT: optionalArgs.mode === 'not' ? { OR: OrWhereArrObj} : undefined,
      OR: optionalArgs.mode === 'or' ? OrWhereArrObj : undefined,
    },
    orderBy: {
      email: sortObj.email ? sortObj.email : undefined,
      firstName: sortObj.firstName ? sortObj.firstName : undefined,
      lastName: sortObj.lastName ? sortObj.lastName : undefined,
      isAuthor: sortObj.isAuthor ? sortObj.isAuthor : undefined,
      isAdmin: sortObj.isAdmin ? sortObj.isAdmin : undefined,
      posts: sortObj.posts ? { _count: sortObj.posts} : undefined,
      comments: sortObj.comments ? { _count: sortObj.comments } : undefined
    },
    include: {
      posts: true,
      comments: true,
      liked_comments: true,
    }
  });
};

// Return user specified by their id
module.exports.findUserById = async (id) => {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      posts: true,
      comments: true,
      liked_comments: true,
    }
  });
};

// Return user specified by their email, use when checking if email already exists
module.exports.findUserByEmail = async(email) => {
  try{
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.error(`Prisma Database Error: Error in finding a user by email`, error);
    throw error;
  }
}

// UPDATE

// Finds a user by their id and update it's data
// req.body accepted fields: "email", "firstName", "lastName", "password", `confirm_password`, "isAuthor", "likedComment", "dislikedComment"
module.exports.updateUserById = async (id, data) => {
  console.log("Update query");
  console.log(data);
  console.log(Object.hasOwn(data, "liked_comments"));

  // Check if update req.body has liked_comment update operation
  let commentId;
  let operation;

  // Check if update operation includes liking/disliking a comment,
  // Piece of code responsible for changing the value of the `likes` field in the Comment model 
  if(Object.hasOwn(data, "liked_comments")){
    // Destructure the 'connect' object to both check if connect is present or not, and get the value of the id of the comment
    const { liked_comments: { connect } } = data;
    // console.log("connect object");
    // console.log(connect);

    // Check if `connect` object is present or not, automatically assumes a `disconnect` object is present if not
    if(connect !== undefined) {
      commentId = connect[0].id;
      operation = "increment";
    } else {
      const { liked_comments: { disconnect } } = data;
      commentId = disconnect[0].id;
      operation = "decrement";
    }
    // console.log("Comment id is:");
    // console.log(commentId);
    // console.log("Updating comment likes");

    // Query to check if there is already a connection to the record being connected, prevents likes value to increase if already connected
    const connection = await prisma.user.findFirst({
      where: {
        id,
        liked_comments: {
          some: {
            id: commentId
          }
        }
      }
    });
    const isAlreadyConnected = !!connection;
    console.log(`is Connected? ${isAlreadyConnected}`);

    // Logical check to only proceed on updating the `likes` field if either:
    // There is not a connection already and the update operation is liking
    // Or If there is already a connection and the update operation is disliking
    if( (!isAlreadyConnected && operation === "increment") || (isAlreadyConnected && operation === "decrement")){
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data:{
          likes: { [operation]: 1}
        }
      })
    };
  }

  // Main query to update other user details
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

// DELETE

// Delete a user specified by the id
module.exports.deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
};
