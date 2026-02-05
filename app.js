//app.js

// For Environment Variables
require('dotenv').config();
// Express Stuff
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

// Routing
const routes = require('./routes');

// Passport stuff
const passport = require('passport');

// Testing: Login route
const jwt = require('jsonwebtoken');

// Makes data payload's body available in `req.body` object
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Homepage');
});

// Local Passport Strategy import and declaration
require('./lib/strategies/passportlocal.js');
const jwtStrat = require('./lib/strategies/jwt.js');

passport.use(jwtStrat);

// Testing Passport Authentication and JWT token

app.post('/login', passport.authenticate('local', { session: false, 
  failureRedirect: '/login-failure' }), 
  (req,res) => {
  const user = req.user;
  const token = jwt.sign(
    { sub: user.id, email: user.email }, 
    process.env.JWT_SECRET, 
    { algorithm: 'HS256',
      expiresIn: "1h"
    });
  return res.status(200).json({
    message: "Authorization granted",
    user,
    token
  })
});

app.get('/protected', passport.authenticate("jwt", { session: false }), async(req, res) => {
  return res.status(200).send('This is a protected route');
});


app.use('/users', routes.usersRoutes);
app.use('/posts', routes.postsRoutes);

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})