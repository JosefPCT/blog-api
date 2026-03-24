const commentQueries = require("./comments-queries.js")
const postQueries = require("../post-queries.js")
const customErrors = require('../../../utils/extended-errors.js');
const prismaUtils = require('../../../utils/prismaUtils.js');

const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/client");

// Creates a comment based on the current user id, the parent post id and the passed data
// Checks if the parent post exists and get its id
// Passes on to the query layer the parsed user id, the parent post id, and the data
// Filter the returning object to remove the internal id of the comment, the internal id of the commenter and 
// Add an author field that has the url of the commenter/user
module.exports.createPostComment = async(publicPostId, userData, data) => {
  try {
    const parentPost = await postQueries.findPostByPublicId(publicPostId)
    if(!parentPost){
      throw new customErrors.NotFound("Post parent of comment not found");
    }
  
    const result = await commentQueries.createCommentByParentPostId(parseInt(userData.id), parentPost.id, data);
    const { id, commenterId, ...filteredData } = result;
    filteredData.author = `/api/v1/users/${userData.id}`;
    return filteredData;
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
// Filter the returning object to remove the internal id of the comments, the internal id of the commenters and the internal id of the post
// Add an author field that has the url of the commenter/user
module.exports.fetchPostComments = async(publicPostId, query) => {
  try {
    const post = await postQueries.findPostByPublicId(publicPostId)
    if(!post){
      throw new customErrors.NotFound("Post parent does not exist");
    }
    const sortObj = await prismaUtils.createSortingFromQuery(query);
    console.log(sortObj);
    const comments = await commentQueries.findAllPostComments(post.id, query, sortObj);

    filteredComments = [];
    comments.forEach((comment) => {
      const { id, commenterId, postId , ...filteredComment } = comment;
      filteredComment.author = `/api/v1/users/${commenterId}`;
      filteredComments.push(filteredComment);
    })

    return filteredComments;
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
// Filter the returning object to remove the internal id of the comment, the internal id of the commenter and the internal id of the post
// Add an author field that has the url of the commenter/user
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
    const { id, commenterId, postId, ...filteredComment } = comment;
    filteredComment.author = `api/v1/users/${commenterId}`;
    return filteredComment;
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}

// Creates a filtered data object from the `data` object argument passed into it, only accepts fields that can be updated
// Checks if the post and comment exists in the DB
// Then call another query to update the comment if no errors
// Filter the returning object to remove the internal id of the update comment, the internal id of the commenter and the internal id of the post
// Add an author field that has the url of the commenter/user
module.exports.updateSpecificPostComment = async(postPublicId, commentPublicId, currentUserData, data) => {
  const fieldsArr = ["text"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if(fieldsArr.includes(key)){
      filteredData[`${key}`] = value;
    }
  });

  console.log(currentUserData);

  try {
    const post = await postQueries.findPostByPublicId(postPublicId);
    if(!post){
      throw new customErrors.NotFound(`No post found by the id of ${postPublicId}`);
    }
    const comment = await commentQueries.findPostCommentByPublicId(commentPublicId, post.id);
    if(!comment){
      throw new customErrors.NotFound(`No comment with the id of ${commentPublicId}, is found in the post with the id of ${postPublicId}`);
    }
    // if(comment.commenterId !== currentUserData.id){
    //   console.log
    //   throw new customErrors.BadRequest("Current user is not authorized to update this comment");
    // }
    const updatedComment = await commentQueries.updatePostCommentByPublicId(commentPublicId, post.id, filteredData);

    const { id, commenterId, postId, ...filteredComment } = updatedComment;
    filteredComment.author = `/api/v1/users/${commenterId}`;

    return filteredComment;
    
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}

// Checks if the post and comment exists in the DB
// Then send another query to delete the comment in the post by the comment's public id and the post's id
// Filter the returning object to remove the internal id of the deleted comment, the internal id of the commenter and the internal id of the post
// Add an author field that has the url of the commenter/user
module.exports.deleteSpecificPostComment = async(postPublicId, commentPublicId, currentUserData) => {
  try {
    const post = await postQueries.findPostByPublicId(postPublicId);
    console.log(post);
    console.log(currentUserData);
    if(!post){
      throw new customErrors.NotFound(`No post found by the id of ${postPublicId}`);
    }
    const comment = await commentQueries.findPostCommentByPublicId(commentPublicId, post.id);
    if(!comment){
      throw new customErrors.NotFound(`No comment with the id of ${commentPublicId}, is found in the post with the id of ${postPublicId}`);
    }
    // if(comment.commenterId !== currentUserData.id || post.id !== currentUserData.id){
    //   throw new customErrors.BadRequest("Current user is not authorized to delete this comment");
    // }
    const deletedComment = await commentQueries.deletePostCommentByPublicId(commentPublicId, post.id);

    const { id, commenterId, postId, ...filteredComment } = deletedComment;
    filteredComment.author = `/api/v1/users/${commenterId}`;

    return filteredComment;
  } catch (error) {
    console.log(error)
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrors.GeneralError("Database Error");
    }
    throw error;
  }
}