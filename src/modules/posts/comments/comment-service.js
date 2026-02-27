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
      throw new customErrors.NotFound("Post parent of comment not found");
    }
  
    const createdComment = await commentQueries.createCommentByParentPostId(parseInt(userId), parentPost.id, data);
    return createdComment;
  } catch (error) {
      console.log(error);
    if( error instanceof PrismaClientKnownRequestError ){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}

// Gets the post id from the public post id argument
// Checks if post exists, then gets all the comments based on the post id
module.exports.fetchPostComments = async(publicPostId) => {
  try {
    const post = await postQueries.findPostByPublicId(publicPostId)
    if(!post){
      throw new customErrors.NotFound("Post parent does not exist");
    }
    const comments = await commentQueries.findAllPostComments(post.id);
    return comments;
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}

// Gets the post id from the public post id argument
// Checks if post exists, then check if the comment exists in the post from the comment's public id and the returned post id
// Returns the entire comment data object
module.exports.fetchSpecificPostComment = async(publicPostId, publicCommentId) => {
  try {
    const post = await postQueries.findPostByPublicId(publicPostId);
    if(!post){
      throw new customErrors.NotFound("Post parent does not exist");
    }
    const comment = await commentQueries.findPostCommentByPublicId(publicCommentId, post.id);
    if(!comment){
      throw new customErrors.NotFound("Comment does not exist or does not exist in this post");
    }
    return comment;
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}

module.exports.updateSpecificPostComment = async(postPublicId, commentPublicId, data) => {
  const fieldsArr = ["text"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if(fieldsArr.includes(key)){
      filteredData[`${key}`] = value;
    }
  });

  try {
    const post = await postQueries.findPostByPublicId(postPublicId);
    if(!post){
      throw new customErrors.NotFound(`No post found by the id of ${postPublicId}`);
    }
    const comment = await commentQueries.findPostCommentByPublicId(commentPublicId, post.id);
    if(!comment){
      throw new customErrors.NotFound(`No comment with the id of ${commentPublicId}, is found in the post with the id of ${postPublicId}`);
    }

    const updatedComment = await commentQueries.updatePostCommentByPublicId(commentPublicId, post.id, filteredData);
    return updatedComment;
    
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}