/*
 * The users api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");
var commons  = require('../../lib');
var config   = require('../../config');
var User     = require('../../models/user');
var Folder   = require('../../models/folder');

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

  var name = req.body.name;
  User.find({name: name})
  .then(user => {
    if (user.length > 0) {
      res.send("User with this name exists.");
    } else {
      var newUser = new User({
        name: name
      });
      newUser.save(function (err, usr) {
        if (err) {
          res.send("An error occured:" + err);
        } else {
          // Create home folder for new user.
          var newFolder = new Folder({
            name: "home",
            userId: usr.id
          });
          newFolder.save(function (err, folder) {
            if (err) console.log(err);
          });
          res.send("User saved.");
        }
      });
    }
  });
});

// Delete users.
router.delete('/delete', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  User.deleteOne({
    name: req.body.name
  }, function (err) {
    if (err) console.log(err);
    res.send("User removed.");
  });
});

module.exports = router;