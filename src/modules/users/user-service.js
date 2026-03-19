// Has a query layer to handle direct db interactions

const queries = require('./user-queries.js');
const passwordUtils = require('../../utils/passwordUtils.js');
const utils = require('../../utils/userUtils.js');
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
    let hashedPass = await passwordUtils.generatePassword(password);
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
// Accepts query object keys of: email, firstName, lastName, isAuthor, isAdmin,  numberOfPosts, numberOfComments, sort, mode
module.exports.getAllUsers = async(query) => {
  try {
    // Creating the sort object to pass onto the query function
    // Basically just replaces the symbols with the appropriate sorting order, while creating it in the object syntax
    const sortObj = await utils.createSortObject(query);
    console.log(sortObj);

    // Get user data from the db
    let users = await queries.fetchAllUsers(query, sortObj);
    if(!users){
      throw new customErrorType.NotFound('No users in the database');
    }

    // Filter the data received from the db
    const filteredUsers = await utils.filterReturnedUsersData(users);
  
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

    const { hash, comments, posts, ...filteredUser } = user;

    filteredUser.posts = await utils.filterUserPosts(posts);
    filteredUser.comments = await utils.filterUserComments(comments);

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
  const filteredData = utils.createUpdateDataObject(data);

  try {
    let user = await queries.findUserById(parseInt(userId));
    if(!user){
      throw new customErrorType.NotFound(`User with id: ${userId} not found, updating data not succesful`);
    }

    console.log(filteredData.email);
    console.log(user.email);

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