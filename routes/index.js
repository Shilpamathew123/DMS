var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DMS', desc: 'Document Manage System : Dashboard.'});
});

module.exports = router;
