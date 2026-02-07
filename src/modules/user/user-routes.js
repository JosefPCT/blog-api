const { Router } = require('express');

const router = Router();

const controller = require('./userController.js');

router.get('/', controller.usersGetRoute);
router.get('/:userId', controller.specificUserGetRoute);

router.post('/', controller.usersPostRoute);

router.put('/:userId', controller.updateUserRoute);

router.delete('/:userId', controller.deleteUserRoute);

module.exports = router;