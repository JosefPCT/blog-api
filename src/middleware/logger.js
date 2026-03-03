module.exports.logger = (req, res, next) => {
    if(!!req.user){
      console.log(req.user)
    } else {
      console.log("Currently not logged in");
    }
    next()
};