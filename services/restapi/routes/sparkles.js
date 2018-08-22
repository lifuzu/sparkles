var express = require('express');
var router = express.Router();
var db = require('../models/sparkles');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ response: 'a GET request for LOOKING at sparkle' });
});

router.post('/', (req, res, next) => {

  var msg = {
    sparkle: req.body.sparkle,
    url: req.body.url,
    author: req.body.author,
    timestamp: new Date().getTime()
  }

  console.log("[DEBUG][sparkle] New sparkle '%j'", msg);

  db.saveSparkle(msg, function (err, saved) {
    if (err || !saved) {
      console.log("<em>There was an error saving your sparkle (%s)</em>", msg);
      return;
    }

    res.json({
      response: 'a POST request for CREATING a sparkle',
      body: req.body
    });
  });
});

module.exports = router;