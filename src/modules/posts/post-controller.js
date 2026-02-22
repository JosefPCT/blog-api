const postsService = require('./post-service.js');
const passport = require("passport");
const { validationResult, matchedData} = require('express-validator')

const validationMiddleware = require('../../middleware/validation.js')

// Handler for POST `/posts` route
module.exports.createPost = [
  passport.authenticate("jwt", { session: false }),
  validationMiddleware.validatePost,
  async(req, res) => {
    console.log('`/posts` POST route handler');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    const createdPost = await postsService.createPost(matchedData(req), req.user);
    console.log('Created Post:', createdPost);
    res.status(200).json(createdPost);
  }
]

// Handler for GET `/posts` route
module.exports.getAllPosts = [
  async(req, res) => {
    console.log(`'/posts' GET route handler`);
    res.status(200).json('GET');
  }
]

// Handler for GET `/posts/:postId` route
module.exports.getPostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' GET route handler`);
    console.log(`:postId is ${req.params.postId}`);
    res.status(200).json(`GET, :postId is ${req.params.postId}`);
  }
]

// Handler for PUT `/posts/:postId` route
module.exports.updatePostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' PUT route handler`);
    console.log(`:postId is ${req.params.postId}`);
    res.status(200).json(`PUT, :postId is ${req.params.postId}`);
  }
]

// Handler for DELETE `/posts/:postId` route
module.exports.deletePostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' DELETE route handler`);
    console.log(`:postId is ${req.params.postId}`);
    res.status(200).json(`DELETE, :postId is ${req.params.postId}`);
  }
]
