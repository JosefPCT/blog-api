// Helper functions 

function checkAdminStatus(user) {
  return user.isAdmin ? true : false;
}

function checkAuthorStatus(user){
  return user.isAuthor ? true: false;
}

function isOwnPost(user, targetPostId){
  return user.posts.find(post => post.publicId === targetPostId);
}

function isOwnComment(user, targetCommentId) {
  return user.comments.find(comment => comment.publicId === targetCommentId);
}

// Helper middleware to use in route handlers to check if user is authenticated and if user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (checkAdminStatus(req.user)) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authorized to view this resource" });
    }
};

module.exports.isAuthor = (req, res, next) => {
  if (checkAuthorStatus(req.user)) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authorized to view this resource" });
    }
}

module.exports.isAdminOrOwner = (req, res, next) => {
  let parsedId;
  if(typeof req.params.userId === "string"){
    parsedId = parseInt(req.params.userId);
  }

  console.log(req.user.id);
  console.log(parsedId);

  if (checkAdminStatus(req.user) || req.user.id === parsedId) {
    next();
  } else {
    res.status(401).json({ msg: "You are not authorized to view this resource"});
  }
}

module.exports.isAdminOrAuthor = (req, res, next) => {
  if (checkAdminStatus(req.user) || checkAuthorStatus(req.user)){
    next();
  } else {
    res.status(401).json( { msg: "You are not authorized to view this message"})
  }
}

module.exports.isAdminOrPostOwner = (req, res, next) => {
  console.log(req.user);
  if (checkAdminStatus(req.user) || checkAuthorStatus(req.user) || isOwnPost(req.user, req.params.postId)) {
    next()
  } else {
    res.status(401).json({ msg: "You are not authorized to do this"});
  }
}

module.exports.canUpdateComment = (req, res, next) => {
  if(checkAdminStatus(req.user) || isOwnComment(req.user, req.params.commentId)){
    next()
  } else {
    res.status(401).json({ msg: "You are not authorized to do this"});
  }
}

module.exports.canDeleteComment = (req, res, next) => {
  if(checkAdminStatus(req.user) || isOwnComment(req.user, req.params.commentId) || isOwnPost(req.user, req.params.postId)){
    next()
  } else {
    res.status(401).json({ msg: "You are not authorized to do this"});
  }
}


