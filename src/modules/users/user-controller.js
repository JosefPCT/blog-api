// const queries = require('./user-queries.js');
// const utils = require('../../utils/passwordUtils.js');
const passport = require("passport");

const userService = require('./user-service.js');
const validationMiddleware = require('../../middleware/validation.js');
const authorizationMiddleware = require('../../middleware/authorization.js');
const { logger } = require('../../middleware/logger.js');

const { validationResult, matchedData } = require('express-validator');

// Handler for POST '/users'
// Can be accessed by everyone
module.exports.usersPostRoute = [
  validationMiddleware.validateUser,
  async(req, res) => {
    console.log('Users POST route');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    const { email, password, firstName, lastName, isAuthor, isAdmin } = matchedData(req);
    const newUser = await userService.register(email, password, firstName, lastName, isAuthor, isAdmin);

    res.status(201).json(newUser);
  }
]

// Handler for GET '/users'
// Can only be accessed by admins
module.exports.usersGetRoute = [
  passport.authenticate("jwt", { session: false }),
  logger,
  authorizationMiddleware.isAdmin,
  async (req, res) => {
    console.log('Users GET Route');
    let users = await userService.getAllUsers();

    res.status(201).json(users);
  }
]

// Handler for GET '/users/:userId'
// Can be accessed by admins or their own user 
module.exports.userIdGetRoute = [
  passport.authenticate("jwt", { session: false }),
  logger,
  authorizationMiddleware.isAdminOrOwner,
  async (req, res) => {
    console.log('users/:userId GET Route');
    const { userId } = req.params;
    // console.log(`Current user id: ${typeof req.user.id}`);
    // console.log(`Req params: ${typeof req.params.userId}`);


    let user = await userService.getUser(userId);
    res.status(200).json(user);
  }    
]

// Handler for PUT/PATCH '/users/:userId' 
// Can be accessed by admins or their own user
module.exports.updateUserIdRoute = [
  passport.authenticate("jwt", { session: false }),
  logger,
  authorizationMiddleware.isAdminOrOwner,
  validationMiddleware.validateUpdateUser,
  async(req, res) => {
    console.log('users/:userId PUT/PATCH Route');
    const { userId } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    
    const user = await userService.updateUserData(userId, matchedData(req));

    if(!user){
      return res.status(404).json({ error: 'User did not exist, user data not updated'});
    }

    res.status(201).json('message: Deleted succesfully');
  }
]

// Handler for DELETE '/users/:userId'
// Can be accessed by admins or their own user
module.exports.deleteUserRoute = [
  passport.authenticate("jwt", { session: false }),
  logger,
  authorizationMiddleware.isAdminOrOwner,
  async(req, res) => {
    console.log('/users/:userId DELETE Route');
    const { userId } = req.params;
    const deletedUser = await userService.deleteUser(userId);

    res.status(200).json({ message: "Deleted user successfully"});
  }
]