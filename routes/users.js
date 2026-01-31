const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json('User Route');
});

router.post('/', (req, res) => {
  const user = req.body;
  console.log(user);
  res.send(user);
});

module.exports = router;