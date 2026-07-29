//app.js
// Importing
// For Environment Variables
require('dotenv').config();

// Express Stuff
const express = require('express');
const cors = require('cors');
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

const allowedOrigins = [
  `http://localhost:5172`,
  `http://localhost:5173`,
  `https://netlify.app`,
  `https://blogfrontapp.netlify.app`
];

const corsOptions = {
  origin: function (origin, callback){
    // Check if the origin is in the whitelist or if it's a local/server-to-server request (no origin)
    if (!origin || allowedOrigins.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// app.use(cors());
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