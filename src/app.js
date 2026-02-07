//app.js

// For Environment Variables
require('dotenv').config();
// Express Stuff
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

// Route files
const routes = require('./api/v1/routes.js');

// Passport stuff
const passport = require('passport');

// Testing: Login route
const jwt = require('jsonwebtoken');

// Makes data payload's body available in `req.body` object
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Local Passport Strategy import and declaration
// JWT Passport Strategy import and declaration
const localStrat = require('./config/passport-local-strategy.js');
const jwtStrat = require('./config/jwt-strategy.js');
passport.use(localStrat);
passport.use(jwtStrat);

// Defining Routes

app.use('/api/users', routes.usersRoutes);
// app.use('/posts', routes.postsRoutes);

// Testing Passport Authentication and JWT token
// Uses passport's authenticate method with local to validate inputted username and password
// If succesful, creates a token using `jwt.sign`, that takes in three things:
// A payload (usually user information to help validate the user i.e id),
// The secret/key to use
// An options object 
// Then send user information with the token to the client
// TODO: might need to remove some sensitive information on the user object (i.e password/hash) 
app.post('/api/login', passport.authenticate('local', { session: false, 
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

// Test Route to test protecting of routes
// Uses the authenticate method of passport with `jwt` strategy to verify the token sent by the client
// Will fail to authorize if token is not validated
app.get('/api/protected', passport.authenticate("jwt", { session: false }), async(req, res) => {
  return res.status(200).send('This is a protected route');
});




app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})