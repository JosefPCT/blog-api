const commentQueries = require("./comments-queries.js")
const postQueries = require("../post-queries.js")
const customErrors = require('../../../utils/extended-errors.js');
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/client");

// Creates a comment based on the current user id, the parent post id and the passed data
// Checks if the parent post exists and get its id
// Passes on to the query layer the parsed user id, the parent post id, and the data
module.exports.createPostComment = async(publicPostId, userId, data) => {
  try {
    const parentPost = await postQueries.findPostByPublicId(publicPostId)
    if(!parentPost){
      throw customErrors.NotFound("Post parent of comment not found")
    }
  
    const createdComment = await commentQueries.createCommentByParentPostId(parseInt(userId), parentPost.id, data);
    return createdComment;
  } catch (error) {
    if( error instanceof PrismaClientKnownRequestError ){
      console.log("Prisma Database Error")
      throw customErrors.GeneralError("Database Error")
    }
    throw error;
  }
}

module.exports.fetchPostComments = async(postId) => {
  
}