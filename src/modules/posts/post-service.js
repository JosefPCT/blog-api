// Has query layer to handle db interactions

const prisma = require("../../config/prisma.js");
const queries = require('./post-queries.js');
const customErrorType = require('../../utils/extended-errors.js');

// Create a post based on sent data and the current user
module.exports.createPost = async(data, userData) => {
  console.log('Create Post (Service Layer)');
  console.log(data);
  console.log(userData);

  const post = await queries.createPostByUserId(data, userData.id);

  if(!post){
    throw new customErrorType.BadRequest(`Error in creating the post`);
  }

  return post;
}

// Returns all posts results
module.exports.fetchAllPosts = async() => {
  const posts = await queries.findAllPosts()
  if(!posts){
    throw new customErrorType.BadRequest(`No posts found`);
  }
  return posts;
}

// Return a specific post
module.exports.fetchSpecificPost = async(postId) => {
  const post = await queries.findPostById(parseInt(postId));
  if(!post){
    throw new customErrorType.NotFound(`No post found by that id`);
  }
  return post;
}

// Update a specific post based on sent data
module.exports.updateSpecificPost = async(postId, data) => {
  const fieldsArr = ["title", "text", "isPublished"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if(fieldsArr.includes(key)){
      // console.log(`${key}: ${value}`);
      filteredData[`${key}`] = value;
    }
  });

  const post = await queries.updatePostById(parseInt(postId), filteredData);
  if(!post){
      throw new customErrorType.NotFound(`Post with id: ${postId} not found, updating post data not succesful`);
  }
  
  return post;
}

// Delete a specific post based on a dynamic url parameter
module.exports.deleteSpecificPost = async(postId) => {
  const post = await queries.findPostById(parseInt(postId));
  if(!post){
    throw new customErrorType.NotFound(`Post with id: ${postId} not found, deleting post unsuccessful`);
  }
  const deletedPost = await queries.deletePostById(parseInt(postId));
  return deletedPost;
}