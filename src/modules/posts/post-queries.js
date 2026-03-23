const prisma = require("../../config/prisma.js");

// Create a post
module.exports.createPostByUserId = async(data, userId) => {
  const post = await prisma.post.create({
    data: {
      authorId: userId,
      title: data.title,
      text: data.text,
      isPublished: data.isPublished
  },
});
  return post;
}

// Find all posts
// Optional arguments from the req.query string `optionalArgs` : title, text, isPublished, dateFrom, dateTo, authorFirstName, authorLastName, numberOfComments, page, mode
// Optional `sortArgs` when `sort` req.query string is present, `sortArgs` can have key values of:  title, text, isPublished, createdAt, updatedAt, comments
module.exports.findAllPosts = async(optionalArgs, sortArgs) => {

  let authorIds = [];
  let postIds = [];

  const createdDateFrom = optionalArgs.dateFrom ? new Date(optionalArgs.dateFrom) : undefined;
  const createdDateTo = optionalArgs.dateTo ? new Date(optionalArgs.dateTo) : undefined;

  if(optionalArgs.authorFirstName || optionalArgs.authorLastName){
    const targetUsers = await prisma.user.findMany({
      where: {
        firstName: optionalArgs.authorFirstName ? { contains: optionalArgs.authorFirstName } : undefined,
        lastName: optionalArgs.authorLastName ? { contains: optionalArgs.authorLastName} : undefined
      },
    });
    authorIds = targetUsers.map(user => user.id);
  }
  
  if(optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0){
    const usersWithCommentCount = await prisma.comment.groupBy({
      by: ['postId'],
      _count: {
        id: true,
      }
    });

    const filteredUsers = usersWithCommentCount.filter(userGrp => userGrp._count.id >= optionalArgs.numberOfComments);
    postIds = filteredUsers.map(comment => comment.postId);
  }

  // const userIds = [...authorIds, ...postIds];

  const whereData = {
    title: optionalArgs.title ? { contains: optionalArgs.title, mode: 'insensitive' } : undefined,
    text: optionalArgs.text ? { contains: optionalArgs.text, mode: 'insensitive' } : undefined,
    isPublished: optionalArgs.isPublished ? ( optionalArgs.isPublished === 'true' ? true : false ) : undefined,
    createdAt: optionalArgs.dateFrom || optionalArgs.dateTo ? { gte: createdDateFrom, lte: createdDateTo} : undefined,
    authorId: optionalArgs.authorFirstName || optionalArgs.authorLastName ? { in: authorIds } : undefined,
    id: (optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0) ? { in: postIds} : undefined,
    comments: optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) === 0 ? { none: {}} : undefined,
  };
  console.log(whereData);

  const OrWhereData = Array.from(Object.keys(whereData), (key) => ({ [key]: whereData[key]}));

  return await prisma.post.findMany({
    take: optionalArgs.page ? 2 : undefined,
    skip: optionalArgs.page ? (optionalArgs.page - 1 ) * 2 : undefined,
    where: {
      AND: optionalArgs.mode === 'and' || optionalArgs.mode === undefined ? whereData : undefined,
      NOT: optionalArgs.mode === 'not' ? { OR: OrWhereData } : undefined,
      OR: optionalArgs.mode === 'or' ? OrWhereData : undefined,
    },
    orderBy: {
      title: sortArgs.title ? sortArgs.title : undefined,
      text: sortArgs.text ? sortArgs.text : undefined,
      isPublished: sortArgs.isPublished ?  sortArgs.isPublished : undefined,
      createdAt: sortArgs.createdAt ? sortArgs.createdAt : undefined,
      updatedAt: sortArgs.updatedAt ? sortArgs.updatedAt : undefined,
      comments: sortArgs.comments ? { _count: sortArgs.comments } : undefined
    }
  });
}

// Find a specific post by their id
module.exports.findPostByPublicId = async(publicId) => {
    return await prisma.post.findFirst({
      where: {
        publicId: publicId,
      },
      include: {
        comments: true
      }
    });
}

// Update a specific post by their id
module.exports.updatePostByPublicId = async (publicId, data) => {
  return await prisma.post.update({
    where: {
      publicId: publicId
    },
    data,
  });
};

// Delete a specific post by their id
module.exports.deletePostByPublicId = async (publicId) => {
  try {
    return await prisma.post.delete({
      where: {
        publicId: publicId,
      },
    });
  } catch (error) {
    console.error(`Prisma Database Error: Error in deleting a user`, error);
    throw error;
  }
};
