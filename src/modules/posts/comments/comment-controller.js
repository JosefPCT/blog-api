const commentsService = require('./comment-service.js');


module.exports.createPostComment = [
  async(req, res) => {
    console.log('/posts/:postId/comments POST route handler');
    res.status(200).json('POST');
  }
]

module.exports.getPostComments = [
  async(req, res) => {
    console.log('`/posts/:postId/comments GET route handler');
    res.status(200).json('GET all comments');
  }
]

module.exports.getSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' GET route handler`);
    res.status(200).json('GET a specific comment');
  }
]

module.exports.updateSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' PUT/PATCH route handler`);
    res.status(200).json('UPDATE a specific commment');
  }
]

module.exports.deleteSpecificPostComment = [
  async(req, res) => {
    console.log(`'/posts/:postId/comments/:commentId' DELETE route handler`);
    res.status(200).json('DELETE a specific comment');
  }
]