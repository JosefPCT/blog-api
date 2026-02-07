const prisma = require("../../config/prisma.js");


// CREATE

// Create user in the User model, email is a required value, other values has default values
module.exports.createNewUser = async(email, firstName='Test', lastName='User', hash='hashplaceholderax123', isAuthor=false) => {
  const user = await prisma.user.create({
    data: {
        email,
        firstName,
        lastName,
        hash,
        isAuthor,
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

module.exports.updateUserById = async(id, data) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data
  });
}

// DELETE

// Delete a user specified by the id
module.exports.deleteUserById = async(id) => {
  return await prisma.user.delete({
    where: {
        id: id
    }
  })
}

