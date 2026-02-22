// const queries = require('./user-queries.js');
// const utils = require('../../utils/passwordUtils.js');
const userService = require('./user-service.js');
const validationMiddleware = require('../../middleware/validation.js');

const { validationResult, matchedData } = require('express-validator');

// Handler for POST '/users'
module.exports.usersPostRoute = [
  validationMiddleware.validateUser,
  async(req, res) => {
    console.log('Users POST route');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    const { email, password, firstName, lastName, isAuthor } = matchedData(req);

    const newUser = await userService.register(email, password, firstName, lastName, isAuthor);

    res.status(201).json(newUser);
  }
]

// Handler for GET '/users'
module.exports.usersGetRoute = [
  async (req, res) => {
    console.log('Users GET Route');
    let users = await userService.getAllUsers();

    res.status(201).json(users);
  }
]

// Handler for GET '/users/:userId'
module.exports.userIdGetRoute = [
  async (req, res) => {
    console.log('users/:userId GET Route');
    const { userId } = req.params;

    let user = await userService.getUser(userId);
    res.status(200).json(user);
  }    
]

// Handler for PUT/PATCH '/users/:userId' 
module.exports.updateUserIdRoute = [
  async(req, res) => {
    console.log('users/:userId PUT/PATCH Route');
    const { userId } = req.params;
    const user = await userService.updateUserData(userId, req.body);

    // if(!user){
    //   return res.status(404).json({ error: 'User did not exist, user data not updated'});
    // }

    res.status(201).json(user);
  }
]

// Handler for DELETE '/users/:userId'
module.exports.deleteUserRoute = [
  async(req, res) => {
    console.log('/users/:userId DELETE Route');
    const { userId } = req.params;
    const deletedUser = await userService.deleteUser(userId);

    res.status(200).json(deletedUser);
  }
]