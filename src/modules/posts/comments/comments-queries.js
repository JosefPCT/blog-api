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
// Possible optionalArgs arguments are: text,dateFrom,dateTo, page, mode, isOwnComment(boolean)
// Possible sortArgs arguments are: text, createdAt, updatedAt, likes
module.exports.findAllPostComments = async(postIdTarg, optionalArgs, sortArgs) => {

  const createdDateFrom = optionalArgs.dateFrom ? new Date(optionalArgs.dateFrom) : undefined;
  const createdDateTo = optionalArgs.dateTo ? new Date(optionalArgs.dateTo) : undefined;

  const whereData = {
    postId: postIdTarg,
    text: optionalArgs.text ? { contains: optionalArgs.text, mode: 'insensitive' } : undefined,
    createdAt: optionalArgs.dateFrom || optionalArgs.dateTo ? { gte: createdDateFrom, lte: createdDateTo } : undefined,
    // authorId: optionalArgs.IsOwnComment === 'true' ? userIdTarg : undefined,
  }

  const { postId, ...newData } = whereData;
  const OrWhereData = Array.from(Object.keys(newData), item => ({ [item]: whereData[item] }));
  
  let option;
  switch(optionalArgs.mode){
    case 'not': 
        console.log("Switch: Not");
        option = { AND: { postId: postId, NOT: OrWhereData}}
        break;
    case 'and': 
        console.log("Switch: And");
        option = { AND: whereData}
        break;
    case 'or': 
        console.log("Switch: or");
        option = { AND: { postId: postId, OR: OrWhereData}}
        break;
    case undefined:
        option = { AND: whereData }
    default: 
        console.log("Switch default");
        option = undefined;
  }

  return await prisma.comment.findMany({
    take: optionalArgs.page ? 2 : undefined,
    skip: optionalArgs.page ? (optionalArgs.page - 1) * 2 : undefined,
    where: option,
    orderBy: {
      text: sortArgs.text ? sortArgs.text : undefined,
      createdAt: sortArgs.createdAt ? sortArgs.createdAt : undefined,
      updatedAt: sortArgs.updatedAt ? sortArgs.updatedAt: undefined,
      liked_by: sortArgs.likes ? { _count: sortArgs.likes }: undefined,
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

// Update/Edit a specific comment based on the passed comment's public id, post's id, and the filtered data
module.exports.updatePostCommentByPublicId = async(commentPublicId, postId, data) => {
  return await prisma.comment.update({
    where: {
      publicId: commentPublicId,
      postId: postId
    },
    data
  });
}

// Delete a specific comment based on the passed comment's public id and post's id
module.exports.deletePostCommentByPublicId = async(commentPublicId, postId) => {
  return await prisma.comment.delete({
    where: {
      publicId: commentPublicId,
      postId: postId
    }
  });
}