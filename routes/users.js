const { Router } = require('express');

const router = Router();

const controller = require('../controllers/userController.js');

router.get('/', controller.usersGetRoute);
router.get('/:userId', controller.specificUserGetRoute);

router.post('/', controller.usersPostRoute);

router.delete('/:userId', controller.deleteUserRoute);

module.exports = router;