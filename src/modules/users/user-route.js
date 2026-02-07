const { Router } = require('express');

const router = Router();

const controller = require('./user-controller.js');

router.get('/', controller.usersGetRoute);
router.get('/:userId', controller.userIdGetRoute);

router.post('/', controller.usersPostRoute);

router.put('/:userId', controller.updateUserIdRoute);

router.delete('/:userId', controller.deleteUserRoute);

module.exports = router;