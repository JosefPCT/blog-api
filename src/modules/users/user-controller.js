// const queries = require('./user-queries.js');
// const utils = require('../../utils/passwordUtils.js');
const userService = require('./user-service.js');

// Handler for POST '/users'
module.exports.usersPostRoute = [
  async(req, res) => {
    try {
      console.log('Users POST route');
      const { email, password, firstName, lastName, isAuthor } = req.body;

      const newUser = await userService.register(email, password, firstName, lastName, isAuthor);

      res.status(201).json(newUser);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
]

// Handler for GET '/users'
module.exports.usersGetRoute = [
  async (req, res) => {
    try {
      console.log('Users GET Route');
      let users = await userService.getAllUsers();

      res.status(201).json(users);

    } catch (error) {
      res.status(500).json({ message: error.message})
    }
  }
]

// Handler for GET '/users/:userId'
module.exports.userIdGetRoute = [
  async (req, res) => {
    try {
      console.log('users/:userId GET Route');
      const { userId } = req.params;

      let user = await userService.getUser(userId);

      if(!user){
        return res.status(404).json({ error: 'User does not exist'});
      }

      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }    
]

// Handler for PUT/PATCH '/users/:userId' 
module.exports.updateUserIdRoute = [
  async(req, res) => {
    try {
      console.log('users/:userId PUT/PATCH Route');
      const { userId } = req.params;

      const user = await userService.updateUserData(userId, req.body);

      if(!user){
        return res.status(404).json({ error: 'User did not exist, user data not updated'});
      }

      res.status(201).json(user);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
]

// Handler for DELETE '/users/:userId'
// Delete a user specified by the :userId param, should return an error message
module.exports.deleteUserRoute = [
  async(req, res) => {
    try {
      console.log('/users/:userId DELETE Route');
      const { userId } = req.params;
      const deletedUser = await userService.deleteUser(userId);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    const { userId } = req.params;
    let result = await queries.deleteUserById(parseInt(userId));
    console.log('Delete user', result);
    res.json(result);
  }
]