const postsService = require('./post-service.js');

// Handler for POST `/posts` route
module.exports.createPost = [
  async(req, res) => {
    console.log('`/posts` POST route handler');
    res.status(200).json('POST');
  }
]

// Handler for GET `/posts` route
module.exports.getAllPosts = [
  async(req, res) => {
    console.log(`'/posts' GET route handler`);
    res.status(200).json('GET');
  }
]

// Handler for GET `/posts/:id` route
module.exports.getPostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' GET route handler`);
    res.status(200).json('GET');
  }
]

// Handler for PUT `/posts/:id` route
module.exports.updatePostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' PUT route handler`);
    res.status(200).json('PUT');
  }
]

// Handler for DELETE `/posts/:id` route
module.exports.deletePostById = [
  async(req, res) => {
    console.log(`'/posts/:postId' DELETE route handler`);
    res.status(200).json('DELETE');
  }
]
