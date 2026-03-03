
const passport = require("passport");
const { validationResult, matchedData} = require('express-validator')

const validationMiddleware = require('../../middleware/validation.js')
const authorizationMiddleware = require('../../middleware/authorization.js')
const postsService = require('./post-service.js');


// Handler for POST `/posts` route
// Uses middleware to make sure users are authenticated and a middleware to handle validation of inputs
// Can only be accessed by an admin or an author
module.exports.createPost = [
  passport.authenticate("jwt", { session: false }),
  authorizationMiddleware.checkRolesCreatePost,
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
// Can be accessed by everyone, both authorized and non authorized users
module.exports.getAllPosts = [
  async(req, res) => {
    console.log(`'/posts' GET route handler`);
    const posts = await postsService.fetchAllPosts();
    res.status(200).json(posts);
  }
]

// Handler for GET `/posts/:postId` route
// Can be accessed by everyone, both authorized and non authorized users
module.exports.getPostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' GET route handler`);
    console.log(`:postId is ${req.params.postId}`);
    const { postId } = req.params;
    console.log(req);
    const post = await postsService.fetchSpecificPost(postId);
    res.status(200).json(post);
  }
]

// Handler for PUT `/posts/:postId` route
// Uses middleware to make sure users are authenticated and a middleware to handle validation of inputs
module.exports.updatePostById = [
  passport.authenticate("jwt", { session: false }),
  validationMiddleware.validateUpdatePost,
  async(req, res) => {
    console.log(`'/posts/:postId' PUT route handler`);
    console.log(`:postId is ${req.params.postId}`);
    const { postId } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const updatedPost = await postsService.updateSpecificPost(postId, matchedData(req));

    if(!updatedPost){
      return res.status(404).json({ error: 'Post did not exist, post data not updated'});
    }

    res.status(200).json(updatedPost);
  }
]

// Handler for DELETE `/posts/:postId` route
module.exports.deletePostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' DELETE route handler`);
    console.log(`:postId is ${req.params.postId}`);
    const { postId } = req.params;
    const deletedPost = await postsService.deleteSpecificPost(postId);
    if(!deletedPost){
      return res.status(404).json({ error: 'Post did not exist, deleting unsuccessful'});
    }
    res.status(200).json(deletedPost);
  }
]
