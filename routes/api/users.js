/*
 * The users api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");
var commons  = require('../../lib');
var config   = require('../../config');
var User     = require('../../models/user');

// List users.
router.get('/', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  User.find()
  .then(users => {
    res.send(users);
  });
});

// Add users.
router.post('/add', function(req, res) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var newUser = new User({
    name: req.body.name
  });
  newUser.save(function (err) {
    if (err) console.log(err);
    res.send("User saved.");
  });
});

module.exports = router;