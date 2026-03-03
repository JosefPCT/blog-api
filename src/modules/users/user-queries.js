const prisma = require("../../config/prisma.js");

// CREATE

// Create user in the User model, email is a required value, other values has default values
module.exports.createNewUser = async (
  email,
  firstName = "Test",
  lastName = "User",
  hash = "hashplaceholderax123",
  isAuthor = false,
  isAdmin = false,
) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        hash,
        isAuthor,
        isAdmin
      },
    });
    return user;
  } catch (error) {
    console.error("Prisma DB: Error creating new user:", error);
    throw error;
  }
};

// READ

// Returns all users in the User Model
module.exports.fetchAllUsers = async () => {
  return await prisma.user.findMany();
};

// Return user specified by their id
module.exports.findUserById = async (id) => {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      posts: true,
      comments: true,
    }
  });
};

// Return user specified by their email, use when checking if email already exists
module.exports.findUserByEmail = async(email) => {
  try{
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.error(`Prisma Database Error: Error in finding a user by email`, error);
    throw error;
  }
}

// UPDATE

// Finds a user by their id and update it's data
module.exports.updateUserById = async (id, data) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

// DELETE

// Delete a user specified by the id
module.exports.deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
};
