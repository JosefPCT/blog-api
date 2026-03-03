// Has query layer to handle db interactions

const prisma = require("../../config/prisma.js");
const queries = require('./post-queries.js');
const customErrorType = require('../../utils/extended-errors.js');
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/client");

// Create a post based on sent data and the current user
module.exports.createPost = async(data, userData) => {
  console.log('Create Post (Service Layer)');
  console.log(data);
  console.log(userData);

  try {
    const post = await queries.createPostByUserId(data, userData.id);
  
    if(!post){
      throw new customErrorType.BadRequest(`Error in creating the post`);
    }
  
    return post;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}

// Returns all posts results
// Filters result from the query to remove, the internal id, and add an author field with the url of the user as the value
module.exports.fetchAllPosts = async() => {
  try {
    const result = await queries.findAllPosts()
    if(!result){
      throw new customErrorType.BadRequest(`No posts found`);
    }
    console.log(result);
    const filteredResult = []
    result.forEach((item) => {
      const { id, authorId, ...newItem } = item
      newItem.author = `/api/v1/users/${authorId}`;
      filteredResult.push(newItem);
    })
    return filteredResult;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}

// Return a specific post
// Handles error handling logic, catches prisma db query errors
// Filters the returned data, removes the internal id, and adds a url path to the actual author of the post
module.exports.fetchSpecificPost = async(publicId) => {
  try {
    const result = await queries.findPostByPublicId(publicId);
    console.log("Post", result);
    if(!result){
      throw new customErrorType.NotFound(`No post found by that id`);
    }

    const { id, authorId, ...filteredResult} = result;
    filteredResult.author = `/api/v1/users/${id}`;
    console.log(filteredResult);
    return filteredResult;
  } catch (error) {
    console.log("Error log.........");
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      console.log("Prisma Query Error");
      throw new customErrorType.GeneralError("Database Error");
      // if(error.code === "P2007"){
      //   throw new customErrorType.BadRequest("Database Error, Database validation error");
      // }
    }
    throw error;
  }
}

// Update a specific post based on sent data
module.exports.updateSpecificPost = async(postPublicId, data) => {
  const fieldsArr = ["title", "text", "isPublished"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if(fieldsArr.includes(key)){
      // console.log(`${key}: ${value}`);
      filteredData[`${key}`] = value;
    }
  });

  try {
    const postCheck = await queries.findPostByPublicId(postPublicId);
    if(!postCheck){
        throw new customErrorType.NotFound(`Post with id: ${postPublicId} not found, updating post data not succesful`);
    }
    const updatedPost = await queries.updatePostByPublicId(postPublicId, filteredData);
    return updatedPost;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}

// Delete a specific post based on a dynamic url parameter
module.exports.deleteSpecificPost = async(publicId) => {
  try {
    const postCheck = await queries.findPostByPublicId(publicId);
    if(!postCheck){
      throw new customErrorType.NotFound(`Post with public id: ${publicId} not found, deleting post unsuccessful`);
    }
    const deletedPost = await queries.deletePostByPublicId(publicId);
    return deletedPost;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}