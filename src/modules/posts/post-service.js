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
    throw new customErrorType.BadRequest(`No posts found`)
  }
  return posts;
}
