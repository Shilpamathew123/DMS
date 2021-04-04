/*
 * The api home.
 */

var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'DMS', desc: 'API home'});
});

module.exports = router;