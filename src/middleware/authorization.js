// Helper middleware to use in route handlers to check if user is authenticated and if user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authorized to view this resource" });
    }
};