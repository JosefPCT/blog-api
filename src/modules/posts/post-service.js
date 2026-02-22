const prisma = require("../../config/prisma.js");
const queries = require('./post-queries.js');
const customErrorType = require('../../utils/extended-errors.js');

module.exports.createPost = async(data, userData) => {
  console.log('Create Post (Service Layer)');
  console.log(data);
  console.log(userData);

  const user = await queries.createPostByUserId(data, userData.id);

  if(!user){
    throw new customErrorType.BadRequest(`Error in creating the post`);
  }

  return user;
}

module.exports.fetchAllPosts = async() => {
  const posts = await queries.findAllPosts()
  if(!posts){
    throw new customErrorType.BadRequest(`No posts found`);
  }
  return posts;
}

module.exports.fetchSpecificPost = async(postId) => {
  const post = await queries.findPostById(parseInt(postId));
  if(!post){
    throw new customErrorType.NotFound(`No post found by that id`);
  }
  return post;
}

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

module.exports.deleteSpecificPost = async(postId) => {
  const post = await queries.findPostById(parseInt(postId));
  if(!post){
    throw new customErrorType.NotFound(`Post with id: ${postId} not found, deleting post unsuccessful`);
  }
  const deletedPost = await queries.deletePostById(parseInt(postId));
  return deletedPost;
}