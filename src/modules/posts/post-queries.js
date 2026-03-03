const prisma = require("../../config/prisma.js");

// Create a post
module.exports.createPostByUserId = async(data, userId) => {
  const post = await prisma.post.create({
    data: {
      authorId: userId,
      title: data.title,
      text: data.text,
      isPublished: data.isPublished
  },
});
  return post
}

// Find all posts
module.exports.findAllPosts = async() => {
  return await prisma.post.findMany();
}

// Find a specific post by their id
module.exports.findPostByPublicId = async(publicId) => {
    return await prisma.post.findFirst({
      where: {
        publicId: publicId,
      },
    });
}

// Update a specific post by their id
module.exports.updatePostByPublicId = async (publicId, data) => {
  return await prisma.post.update({
    where: {
      publicId: publicId
    },
    data,
  });
};

// Delete a specific post by their id
module.exports.deletePostByPublicId = async (publicId) => {
  try {
    return await prisma.post.delete({
      where: {
        publicId: publicId,
      },
    });
  } catch (error) {
    console.error(`Prisma Database Error: Error in deleting a user`, error);
    throw error;
  }
};
