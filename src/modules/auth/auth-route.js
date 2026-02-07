const { Router } = require('express');

const router = Router();

const controller = require('./auth-controller.js');

router.post('/login', controller.loginPostRoute);
router.get('/test-route', controller.testGetRoute);

module.exports = router;