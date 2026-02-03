const queries = require('../lib/queries.js');

// Handler for POST '/users'
// Creates a user based on sent information via JSON
// TODO:
// Need to validate information sent
// Check if sent email value already exists in the DB
// Return proper status and message
module.exports.usersPostRoute = [
  async(req, res) => {
    console.log('Users POST route');
    const { email, firstName, lastName, hash, isAuthor } = req.body;
    let result = await queries.createNewUser(email, firstName, lastName, hash, !!isAuthor);
    res.json(result);
  }
]

// Handler for GET '/users'
// Returns all users 
module.exports.usersGetRoute = [
  async (req, res) => {
    console.log('Users GET Route');
    let result = await queries.getAllUsers();
    res.json(result);
  }
]

// Handler for GET '/users/:userId'
// Return a user specified by their id, returns error message if user is not found in the DB
module.exports.specificUserGetRoute = [
  async (req, res) => {
    console.log('users/:userId GET Route');
    const { userId } = req.params;
    let result = await queries.getUserById(parseInt(userId));

    if(!result){
      return res.status(404).json({ error: 'User does not exist' })
    }
    res.json(result);
  }    
]

// Handler for PUT/PATCH '/users/:userId' 
// Updata a user record specified by the :userId params
module.exports.updateUserRoute = [
  async(req, res) => {
    console.log('users/:userId PUT/PATCH Route');
    const { userId } = req.params;
    // const { email, firstName, lastName, hash, isAuthor } = req.body;
    const detailsArr = [ "email", "firstName", "lastName", "hash", "isAuthor"];
    const data = {};
    
    // Object.entries(req.body).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`);
    // });

    Object.entries(req.body).forEach(([key, value]) => {
      if(detailsArr.includes(key)){
        // console.log(`${key}: ${value}`);
        data[`${key}`] = value;
      }
    });
    let result = await queries.updateUserById(parseInt(userId), data);

    res.json(result);
  }
]

// Handler for DELETE '/users/:userId'
// Delete a user specified by the :userId param, should return an error message
module.exports.deleteUserRoute = [
  async(req, res) => {
    console.log('/users/:userId DELETE Route');
    const { userId } = req.params;
    let result = await queries.deleteUserById(parseInt(userId));
    console.log('Delete user', result);
    res.json(result);
  }
]