const prisma = require("../../../config/prisma.js");
const postQueries = require("../post-queries.js")

module.exports.createPostComment = async(publicPostId, userId, data) => {

  const parentPost = await postQueries.findPostByPublicId(publicPostId)

  const createdComment = await prisma.comment.create({
    data: {
      commenterId: userId,
      postId: parentPost.id,
      text: data.text
    }
  })
  return createdComment;
}

module.exports.fetchPostComments = async(postId) => {
  
}