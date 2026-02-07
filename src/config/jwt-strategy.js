// Exports a strategy to be used by passport
// Verifies the token received from the client
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userQueries = require('../modules/users/user-queries.js');

// Options object
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// Gets the id from the payload from sub/id and checks if user exists
module.exports = new JwtStrategy(opts, async(jwt_payload, done) => {
  try {
    const user = await userQueries.getUserById(jwt_payload.sub);
    if(user){
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});