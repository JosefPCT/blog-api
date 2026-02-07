const bcrypt = require('bcryptjs');

// Generate a hash using a salt, this function is used when creating a user
async function generatePassword(pass) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  return hash;
}

// Validates password to the user's stored hash
// Using bcrypt's compare function, no need to resalt hash
async function validatePassword(pass, hash) {
  return await bcrypt.compare(pass, hash);
}

module.exports = {
  generatePassword,
  validatePassword,
}