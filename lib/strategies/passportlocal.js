// Exports a strategy to use for passport, 
// Use to validate login credentials via email and password  
// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../prisma.js');
const utils = require('../utils/passwordUtils.js');

// Options object to pass creating the strategy
const opts = {
  usernameField: "email",
  passwordField: "password",
};

// Callback to  use when using `passport.authenticate()`
// Using the sent inputs, find the user and checks their password
const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: username,
      }
    });

    if(!user){
      return done(null, false, { message: "Incorrect details"});
    }

    const isValid = await utils.validatePassword(password, user.hash);

    if(isValid){
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect details"});
    }
  } catch (err) {
    return done(err);
  }
}

module.exports =  new LocalStrategy(opts, verifyCallback);

// Declare the strategy to use
// passport.use(localStrat);   