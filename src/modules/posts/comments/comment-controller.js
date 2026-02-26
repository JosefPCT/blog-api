const passport = require("passport");
const { validationResult, matchedData} = require('express-validator')

const validationMiddleware = require('../../../middleware/validation.js')
const commentsService = require('./comment-service.js');


module.exports.createPostComment = [
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    console.log('/posts/:postId/comments POST route handler');
    console.log(`:postId is ${req.params.postId}`);
    console.log(req.user);
    const createdComment = await commentsService.createPostComment(req.params.postId, parseInt(req.user.id), req.body);
    res.status(200).json(createdComment)
    // res.status(200).json(`POST a comment, :postId is ${req.params.postId}`);
  }
]

module.exports.getPostComments = [
  async(req, res) => {
    console.log('`/posts/:postId/comments GET route handler');
    console.log(`:postId is ${req.params.postId}`);
    res.status(200).json(`GET all comments, :postId is ${req.params.postId}`);
  }
]

module.exports.getSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' GET route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    res.status(200).json(`GET a specific comment, :postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
  }
]

module.exports.updateSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' PUT/PATCH route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    res.status(200).json(`UPDATE a specific comment, :postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
  }
]

module.exports.deleteSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' DELETE route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    res.status(200).json(`DELETE a specific comment, :postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
  }
]