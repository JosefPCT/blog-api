const prisma = require("../../config/prisma.js");

module.exports.createPost = async(data, userData) => {
  console.log('Create Post (Service Layer)');
  console.log(data);
  console.log(userData);

  const user = prisma.post.create({
    data: {
      authorId: userData.id,
      title: data.title,
      text: data.text,
      isPublished: true
    }
  })

  return user;
}