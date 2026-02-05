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
require('./lib/passportlocal.js');

// Testing Passport Authentication

app.post('/login', passport.authenticate('local', { session: false, 
  failureRedirect: '/login-failure' }), 
  (req,res) => {
  const token = jwt.sign(
    { user: req.user }, 
    process.env.JWT_SECRET, 
    { algorithm: 'HS256',
      expiresIn: "1h"
    });
  return res.status(200).json({
    message: "Authorization granted",
    token
  })
});


app.use('/users', routes.usersRoutes);
app.use('/posts', routes.postsRoutes);

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})