const queries = require('../lib/queries.js');

module.exports.usersGetRoute = [
  async (req, res) => {
    res.json('Users GET Route');
  }
]

module.exports.usersPostRoute = [
  async(req, res) => {
    const user = req.body;
    console.log(user);
    res.json('Users POST Route');
  }
]