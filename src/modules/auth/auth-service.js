require("dotenv").config();


const jwt = require("jsonwebtoken");

const customErrorType = require('../../utils/extended-errors.js');

// Creates a token using `jwt.sign`, that takes in three things:
// A payload (usually user information to help validate the user i.e id),
// The secret/key to use
// An options object 
// Then send user information with the token to the client
// TODO: might need to remove some sensitive information on the user object (i.e password/hash) 
module.exports.loginWithJwt = (id, email) => {
  const token = jwt.sign({ sub: id, email: email }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  if(!token){
    throw new customErrorType.BadRequest(`Token not created succesfully`);
  }

  return token;
};
