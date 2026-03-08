// Has a query layer to handle direct db interactions

const queries = require('./user-queries.js');
const utils = require('../../utils/passwordUtils.js');
const customErrorType = require('../../utils/extended-errors.js');
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/client");

// Creates a user based on sent data
// Checks if email sent already exists in the db
module.exports.register = async(email, password, firstName, lastName, isAuthor, isAdmin) => {
  try {
    let existingEmail = await queries.findUserByEmail(email);
    if(existingEmail){
      throw new Error(`Email already exists`);
    }
    let hashedPass = await utils.generatePassword(password);
    let result;
    if(!!isAdmin){
      result = await queries.createNewUser(email, firstName, lastName, hashedPass, isAuthor, isAdmin);
    } else {
      result = await queries.createNewUser(email, firstName, lastName, hashedPass, isAuthor);
    }
    
    if(!result){
      throw new customErrorType.BadRequest(`User not created`);
    }
    const { hash, ...filteredResult } = result;
    return filteredResult;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }

}

// Returns all users 
// TODO: Filters data based on optional arguments
module.exports.getAllUsers = async() => {
  try {
    let users = await queries.fetchAllUsers();
  
    if(!users){
      throw new customErrorType.NotFound('No users in the database');
    }

    const filteredUsers = [];
    users.forEach((user) => {
      const { hash, ...filteredUser } = user;
      filteredUsers.push(filteredUser); 
    })
  
    return filteredUsers;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}

// Fetch and return a user and their data
// Return a user specified by their id, returns error message if user is not found in the DB
module.exports.getUser = async(id) => {
  try {
    let user = await queries.findUserById(parseInt(id));
  
    if(!user){
      throw new customErrorType.NotFound(`User with id: ${id} not found`);
    }

    // Figure out how to remove the internal ids of the related records and add an `author` field with the url of the user as the value

    const filteredComments  = [];
    const filteredPosts = [];
    const { hash, comments, posts, ...filteredUser } = user;

    posts.forEach(post => {
      const { id, authorId, ...filteredPost } = post;
      filteredPost.author = `/api/v1/users/${authorId}`;
      filteredPosts.push(filteredPost);
    })
    filteredUser.posts = filteredPosts;

    comments.forEach(comment => {
      const { id, commenterId, ...filteredComment } = comment;
      filteredComment.author = `/api/v1/users/${commenterId}`;
      filteredComments.push(filteredComment);
    })

    filteredUser.comments = filteredComments;

    return filteredUser;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}

// Update a user record specified by the :userId params
// Creates filtered data and sent to the query function to update
// Filters data by checking if req.body includes valid fieldnames and ignores if not valid fieldname, accounts for if req.body have missing valid fieldname
module.exports.updateUserData = async(userId, data) => {
  const detailsArr = [ "email", "firstName", "lastName", "hash", "isAuthor"];
  const filteredData = {};

  Object.entries(data).forEach(([key, value]) => {
    if(detailsArr.includes(key)){
      // console.log(`${key}: ${value}`);
      filteredData[`${key}`] = value;
    }
  });

  try {
    let user = await queries.findUserById(parseInt(userId));
    if(!user){
      throw new customErrorType.NotFound(`User with id: ${userId} not found, updating data not succesful`);
    }

    console.log(filteredData.email);
    console.log(user.email);

    // Code that double checks for same email when updating
    // let updatedUser;
    // if(filteredData.email === user.email){
    //   console.log("Email and email to update is the same");
    //   const { email, ...newFilteredData } = filteredData;
    //   updatedUser = await queries.updateUserById(parseInt(userId), newFilteredData);
    // } else {
      // updatedUser = await queries.updateUserById(parseInt(userId), filteredData);
    // }

    const updatedUser = await queries.updateUserById(parseInt(userId), filteredData);
  
    if(!updatedUser){
      throw new customErrorType.NotFound(`Updating data not succesful`);
    }

    const { hash, ...filteredUser } = updatedUser; 
  
    return filteredUser;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002"){
        throw new customErrorType.GeneralError(`Unique constraint error, ${error.message}`);
      }

      throw new customErrorType.GeneralError("Database Error");

    }
    throw error;
  }
}

// Delete a user specified by the :userId param, should return an error message
// Might not need to return anything, just a success message when deleted successfully
module.exports.deleteUser = async(userId) => {
  try {
    let deletedUser = await queries.deleteUserById(parseInt(userId));
  
    if(!deletedUser){
      throw new customErrorType.NotFound(`User with id: ${userId} not found, deleting data unsuccesful`);
    }
  
    return deletedUser;
  } catch (error) {
    console.log(error);
    if(error instanceof PrismaClientKnownRequestError){
      throw new customErrorType.GeneralError("Database Error");
    }
    throw error;
  }
}