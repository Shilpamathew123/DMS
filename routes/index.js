var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json('Document Manage System : Dashboard.');
});

module.exports = router;
