//app.js
// Importing
// For Environment Variables
require('dotenv').config();

// Express Stuff
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Route files import
const apiRouter = require('./api/v1/routes.js');

// Passport stuff
const passport = require('passport');

// Custom Middlewares
const { notFoundErrorHandler } = require('./middleware/notFoundErrorHandler.js');
const { globalErrorHandler } = require('./middleware/globalErrorHandler.js');

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
app.use('/api/v1', apiRouter);

// Not Found Error Middleware
app.use(notFoundErrorHandler);
// Global Error Middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})