// Helper middleware to use in route handlers to check if user is authenticated and if user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authorized to view this resource" });
    }
};

module.exports.isAdminOrOwnUserData = (req, res, next) => {
  let parsedId;
  if(typeof req.params.userId === "string"){
    parsedId = parseInt(req.params.userId);
  }

  console.log(req.user.id);
  console.log(parsedId);

  if (req.user.isAdmin || req.user.id === parsedId) {
    next();
  } else {
    res.status(401).json({ msg: "You are not authorized to view this resource"});
  }
}