module.exports.logger = (req, res, next) => {
    if(!!req.user){
      console.log(req.user)
      console.log(`Req.user.admin: ${req.user.isAdmin}`);
    } else {
      console.log("Currently not logged in");
    }
    next()
};