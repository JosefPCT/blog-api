const queries = require('./user-queries.js');
const utils = require('../../utils/passwordUtils.js');
const customErrorType = require('../../utils/extended-errors.js');

// Creates a user based on sent parameters
// TODO:
// Need to validate information sent
// Check if sent email value already exists in the DB
module.exports.register = async(email, password, firstName, lastName, isAuthor) => {
  try {
    let hash = await utils.generatePassword(password);
    let result = await queries.createNewUser(email, firstName, lastName, hash, isAuthor);
    return result;
  } catch (error) {
    console.error('Error in userService.register: ', error.message);
    throw error;
  }
}

// Returns all users 
module.exports.getAllUsers = async() => {
  try {
    let users = await queries.fetchAllUsers();

    if(!users){
      throw new Error('No users in the Database');
    }

    return users;
  } catch (error) {
    console.error('Error in userService.getAllUsers: ', error.message);
    throw error;
  }
}

// Fetch and return a user and their data
// Return a user specified by their id, returns error message if user is not found in the DB
module.exports.getUser = async(id) => {
  // try {
    let user = await queries.findUserById(parseInt(id));
    if(!user){
      throw new customErrorType.NotFound(`User with id: ${id} not found`);
    }
    return user;
  // } catch (error) {
    // console.error('Error in userService.getUser: ', error.message);
    // throw error;
  // }
}

// Update a user record specified by the :userId params
// Creates filtered data and sent to the query function to update
// Filters data by checking if req.body includes valid fieldnames and ignores if not valid fieldname, accounts for if req.body have missing valid fieldname
module.exports.updateUserData = async(userId, data) => {
  try {
    const detailsArr = [ "email", "firstName", "lastName", "hash", "isAuthor"];
    const filteredData = {};

    Object.entries(data).forEach(([key, value]) => {
      if(detailsArr.includes(key)){
        // console.log(`${key}: ${value}`);
        filteredData[`${key}`] = value;
      }
    });

    const user = await queries.updateUserById(parseInt(userId), filteredData);

    return user;

  } catch (error) {
    console.error('Error in userService.updateUserData: ', error.message);
    throw error;
  }
}

// Delete a user specified by the :userId param, should return an error message
module.exports.deleteUser = async(userId) => {
  try {
    let deletedUser = await queries.deleteUserById(parseInt(userId));
    return deletedUser;
  } catch (error) {
    console.error('Error in userService.deleteUser: ', error.message);
    throw error;
  }
}