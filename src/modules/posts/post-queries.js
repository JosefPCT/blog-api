const prisma = require("../../config/prisma.js");

module.exports.createPostByUserId = async(data, userId) => {
  try {
    const user = await prisma.post.create({
      data: {
      authorId: userId,
      title: data.title,
      text: data.text,
      isPublished: data.isPublished
    },
  });
    return user
  } catch (error) {
    console.error("Prisma Error in creating a new post ", error);
    throw error;
  }
}

module.exports.findAllPosts = async() => {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error("Prisma Error in creating a new post ", error);
    throw error;
  }
}