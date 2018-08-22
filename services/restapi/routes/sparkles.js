var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ response: 'a GET request for LOOKING at sparkle' });
});

router.post('/', (req, res, next) => {
  res.json({
    response: 'a POST request for CREATING a sparkle',
    body: req.body
  });
});

module.exports = router;