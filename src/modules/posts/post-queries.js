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
module.exports.findAllPosts = async(optionalArgs) => {

  let userIdsForComments = [];
  let authorIds = [];

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
    userIdsForComments = filteredUsers.map(comment => comment.postId);
  }

  const userIds = [...authorIds, ...userIdsForComments];
  console.log(optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0);

  
  // console.log(targetUserIds);

  const whereData = {
    title: optionalArgs.title ? { contains: optionalArgs.title } : undefined,
    text: optionalArgs.text ? { contains: optionalArgs.text } : undefined,
    isPublished: optionalArgs.isPublished ? ( optionalArgs.isPublished === 'true' ? true : false ) : undefined,
    createdAt: optionalArgs.dateFrom || optionalArgs.dateTo ? { gte: createdDateFrom, lte: createdDateTo} : undefined,
    authorId: optionalArgs.authorFirstName || optionalArgs.authorLastName ? { in: userIds } : undefined,
    id: (optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) !== 0) ? { in: userIds} : undefined,
    comments: optionalArgs.numberOfComments && parseInt(optionalArgs.numberOfComments) === 0 ? { none: {}} : undefined,
  };

  console.log(whereData);

  return await prisma.post.findMany({
    where: whereData
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
