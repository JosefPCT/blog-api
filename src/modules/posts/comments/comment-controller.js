const passport = require("passport");
const { validationResult, matchedData} = require('express-validator')

const validationMiddleware = require('../../../middleware/validation.js')
const commentsService = require('./comment-service.js');


// Route handler for POST '/post/:postId/comments', Create a comment on the post
module.exports.createPostComment = [
  passport.authenticate("jwt", { session: false }),
  validationMiddleware.validateCreateComment,
  async(req, res) => {
    console.log('/posts/:postId/comments POST route handler');
    console.log(`:postId is ${req.params.postId}`);
    console.log(req.user);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json(errors)
    }
    const createdComment = await commentsService.createPostComment(req.params.postId, req.user.id, matchedData(req))
    res.status(200).json(createdComment)
  }
]

// Route handler for GET '/post/:postId/comments', Get all the comments of the post
module.exports.getPostComments = [
  async(req, res) => {
    console.log('`/posts/:postId/comments GET route handler');
    console.log(`:postId is ${req.params.postId}`);
    const comments = await commentsService.fetchPostComments(req.params.postId);
    res.status(200).json(comments);
  }
]

// Route handler for GET '/post/:postId/comments/:commentId
module.exports.getSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' GET route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    const comment = await commentsService.fetchSpecificPostComment(req.params.postId,req.params.commentId )
    res.status(200).json(comment);
  }
]

// Route handler for PUT '/post/:postId/comments/:commentId 
module.exports.updateSpecificPostComment = [
  passport.authenticate("jwt", { session: false }),
  validationMiddleware.validateUpdateComment,
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' PUT/PATCH route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    console.log(req.user.id);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json(errors)
    }
    const updatedComment = await commentsService.updateSpecificPostComment(req.params.postId, req.params.commentId, req.user, matchedData(req));
    res.status(200).json(updatedComment);
  }
]

// Route handler for DELETE '/post/:postId/comments/:commentId
module.exports.deleteSpecificPostComment = [
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' DELETE route handler`);
    console.log(`:postId is ${req.params.postId}, :commentId is ${req.params.commentId}`);
    const deletedComment = await commentsService.deleteSpecificPostComment(req.params.postId, req.params.commentId, req.user);
    res.status(200).json(deletedComment);
  }
]