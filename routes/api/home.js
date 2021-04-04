/*
 * The api home.
 */

var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.json('API home');
});

module.exports = router;