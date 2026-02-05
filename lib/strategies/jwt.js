require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const queries = require('../queries.js');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

module.exports = new JwtStrategy(opts, async(jwt_payload, done) => {
  try {
    const user = await queries.getUserById(jwt_payload.sub);
    if(user){
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});