const authService = require("./auth-service.js");
const passport = require("passport");

// Handler for POST '/login'
// Uses passport's authenticate method with local to validate inputted username and password
// If succesful, creates a token and send to client
module.exports.loginPostRoute = [
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/login-failure",
  }),
  (req, res) => {
    try {
      console.log("POST route /login ");
      const user = req.user;
      const token = authService.loginWithJwt(user.id, user.email);
      return res.status(200).json({
        message: "Authorization granted",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Test Route to test protecting of routes
// Uses the authenticate method of passport with `jwt` strategy to verify the token sent by the client
// Will fail to authorize if token is not validated
module.exports.testGetRoute = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.dir(`Current user:`, req.user);
    // return res.status(200).send("This is a protected route");
    return res.status(200).json({ message: 'Protected route Test route', user: req.user})
  },
];
