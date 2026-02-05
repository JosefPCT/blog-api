//app.js

// For Environment Variables
require('dotenv').config();
// Express Stuff
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

// Routing
const routes = require('./routes');

// Testing
const passport = require('passport');

// Makes data payload's body available in `req.body` object
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Homepage');
});

// Local Passport Strategy import and declaration
require('./lib/passportlocal.js');

// Testing Passport Authentication

app.post('/login', passport.authenticate('local', { session: false, failureRedirect: '/login-failure' }), (req,res) => {
  res.send(req.user);
});


app.use('/users', routes.usersRoutes);
app.use('/posts', routes.postsRoutes);

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})