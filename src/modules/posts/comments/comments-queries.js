const prisma = require("../../../config/prisma.js");

// Creates a comment, based on the three required arguments
module.exports.createCommentByParentPostId = async (
  userId,
  parentPostId,
  data,
) => {
  return await prisma.comment.create({
    data: {
      commenterId: userId,
      postId: parentPostId,
      text: data.text,
    },
  });
};

// Finds all comments based on the passed postId
module.exports.findAllPostComments = async(postId) => {
  return await prisma.comment.findMany({
    where: {
      postId: postId
    }
  })
}

// module.exports.findPostCommentById = async(commentId, postId) => {
//   return await prisma.comment.findFirst({
//     where: {
//       id: commentId,
//       postId: postId
//     }
//   })
// }

// Finds a specific comment based on the passed postId and the comment's publicId
module.exports.findPostCommentByPublicId = async(commentPublicId, postId) => {
  return await prisma.comment.findFirst({
    where:{
      publicId: commentPublicId,
      postId: postId,
    }
  })
}

module.exports.updatePostCommentByPublicId = async(commentPublicId, postId, data) => {
  return await prisma.comment.update({
    where: {
      publicId: commentPublicId,
      postId: postId
    },
    data
  });
}