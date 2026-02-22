
const passport = require("passport");
const { validationResult, matchedData} = require('express-validator')

const validationMiddleware = require('../../middleware/validation.js')
const postsService = require('./post-service.js');

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
    const posts = await postsService.fetchAllPosts();
    res.status(200).json(posts);
  }
]

// Handler for GET `/posts/:postId` route
module.exports.getPostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' GET route handler`);
    console.log(`:postId is ${req.params.postId}`);
    const { postId } = req.params;
    const post = await postsService.fetchSpecificPost(postId);
    res.status(200).json(post);
  }
]

// Handler for PUT `/posts/:postId` route
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
    res.status(200).json(`DELETE, :postId is ${req.params.postId}`);
  }
]
