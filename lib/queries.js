const prisma = require("./prisma.js");

// Users Resource

// CREATE

module.exports.createNewUser = async(email, firstName='Test', lastName='User', hash='hashplaceholderax123', isAuthor=false) => {
  const user = await prisma.user.create({
    data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        hash: hash,
        isAuthor: isAuthor,
    }
  }); 
  return user;
}

// READ

// Returns all users in the User Model
module.exports.getAllUsers = async() => {
  return await prisma.user.findMany();
}

// Return user specified by their id
module.exports.getUserById = async(id) => {
  return await prisma.user.findFirst({
    where: {
        id: id
    }
  })
}

// UPDATE

// DELETE

// Posts Resource

// Comments Resource