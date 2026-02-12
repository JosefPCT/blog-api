//app.js
// Importing
// For Environment Variables
require('dotenv').config();

// Express Stuff
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Route files import
const routes = require('./api/v1/routes.js');

// Passport stuff
const passport = require('passport');

// Main App Logic

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
app.use('/api/auth', routes.authRoutes);


// Global Error Handler
app.use((err, req, res, next) =>  {
  console.error(err.stack);
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';

  // Don't send error stack in production environment
  if(process.env.NODE_ENV === 'production') {
    res.status(statusCode).send({ status: 'error', message: message });
  } else {
    res.status(statusCode).send({ status: 'error', message: message, stack: err.stack });
  }
});

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})