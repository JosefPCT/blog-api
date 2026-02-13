const { Router } = require('express');

const router = Router();

const controller = require('./post-controller.js');

router.post('/', controller.createPost);

router.get('/', controller.getAllPosts);
router.get('/:id', controller.getPostById);

router.put('/:id', controller.updatePostById);

router.delete('/:id', controller.deletePostById);

module.exports = router;