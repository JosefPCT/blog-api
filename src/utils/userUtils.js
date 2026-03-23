// Utility functions used by `getAllUsers()` function from the service layer
// Checks if req.query is not empty
module.exports.isQueryEmpty = (query) => {
  if (Object.keys(query).length !== 0) {
    console.log(`Has req query`, query);
    return false;
  } else {
    console.log("No req query");
    return true;
  }
};

// MOVED TO prismaUtils file
// Creating the sort object to pass onto the query function
// Basically just replaces the symbols with the appropriate sorting order, while creating it in the object syntax
// module.exports.createSortObject = (query) => {
//   const sortObj = {};
//   if (!!query.sort) {
//     console.log(query.sort);
//     console.log(query.sort.split(","));
//     let arr = query.sort.split(",");
//     arr.forEach((item) => {
//       let sort;
//       let symbol = item.slice(0, 1);
//       let key = item.slice(1, item.length);
//       console.log(symbol);
//       console.log(key);
//       if (symbol === "+" || symbol === " ") {
//         sort = "asc";
//       } else if (symbol === "-") {
//         sort = "desc";
//       } else {
//         sort = "undefined";
//       }
//       sortObj[key] = sort;
//     });
//   }
//   return sortObj;
// };

// Filter the users data by removing the sensitive hash field from the returned data, returns the users object without the hash field
module.exports.filterReturnedUsersData = (users) => {
  const filteredUsers = [];
  users.forEach((user) => {
    const { hash, ...filteredUser } = user;
    filteredUsers.push(filteredUser);
  });
  return filteredUsers;
};

// Utility functions used by `getUser()` from the service layer
// Filters the user's related 'post' records by removing the internal id and replacing authorId field with an author field
module.exports.filterUserPosts = (posts) => {
  const filteredPosts = [];
  posts.forEach((post) => {
    const { id, authorId, ...filteredPost } = post;
    filteredPost.author = `/api/v1/users/${authorId}`;
    filteredPosts.push(filteredPost);
  });
  return filteredPosts;
};

// Filters the user's related 'comment' records by removing the internal id and replacing authorId field with an author field
module.exports.filterUserComments = (comments) => {
  const filteredComments = [];
  comments.forEach((comment) => {
    const { id, commenterId, ...filteredComment } = comment;
    filteredComment.author = `/api/v1/users/${commenterId}`;
    filteredComments.push(filteredComment);
  });
  return filteredComments;
};

// Utility functions used by `updateUserData()` from the service layer

// Create the data object to pass on to the update query, only includes fields that are present on the req.body
module.exports.createUpdateDataObject = (data) => {
  const detailsArr = ["email", "firstName", "lastName", "hash", "isAuthor"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if (detailsArr.includes(key)) {
      // console.log(`${key}: ${value}`);
      filteredData[`${key}`] = value;
    }
  });
  return filteredData;
};

// NOTE: Obsolete code, prisma already checks for unique constrain on email automatically when using `@unique` in the schema
// Code that double checks for same email when updating
// let updatedUser;
// if(filteredData.email === user.email){
//   console.log("Email and email to update is the same");
//   const { email, ...newFilteredData } = filteredData;
//   updatedUser = await queries.updateUserById(parseInt(userId), newFilteredData);
// } else {
    // updatedUser = await queries.updateUserById(parseInt(userId), filteredData);
// }