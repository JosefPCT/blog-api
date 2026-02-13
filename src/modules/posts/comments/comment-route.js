const { Router } = require('express');
const router = Router({ mergeParams: true});

const controller = require('./comment-controller.js');

router.post('/', controller.createPostComment);

router.get('/', controller.getPostComments);
router.get('/:commentId', controller.getSpecificPostComment);

router.put('/:commentId', controller.updateSpecificPostComment);

router.delete('/:commentId', controller.deleteSpecificPostComment);

module.exports = router;