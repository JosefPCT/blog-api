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
