const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.send('Users Route');
});

module.exports = router;