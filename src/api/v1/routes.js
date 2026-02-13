const { Router } = require('express');
const apiRouter = Router();

const usersRoutes = require('../../modules/users/user-route.js');
const authRoutes = require('../../modules/auth/auth-route.js');
const postRoutes = require('../../modules/posts/post-route.js');

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/posts', postRoutes);

module.exports = apiRouter;