const { Router } = require('express');

const router = Router();

const controller = require('./post-controller.js');

router.post('/', controller.createPost);

router.get('/', controller.getAllPosts);
router.get('/:postId', controller.getPostById);

router.put('/:postId', controller.updatePostById);

router.delete('/:postId', controller.deletePostById);

module.exports = router;