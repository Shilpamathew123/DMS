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
var File     = require('../../models/file');

// List users.
router.get('/', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  var search = {};
  if (req.query.name) {
    search.name = req.query.name;
  }
  User.find(search)
  .then(users => {
    res.json(users);
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
      res.json("User with this name exists.");
    } else {
      var newUser = new User({
        name: name
      });
      newUser.save(function (err, usr) {
        if (err) {
          res.json("An error occured:" + err);
        } else {
          // Create home folder for new user.
          var newFolder = new Folder({
            name: "home",
            userId: usr.id
          });
          newFolder.save(function (err, folder) {
            if (err) console.log(err);
          });
          res.json("User saved.");
        }
      });
    }
  });
});

// Edit user.
router.post('/edit/:userId', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var userId = req.params.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findOne({_id: userId})
    .then(user => {
      if (user) {
        if (req.body.name) {
          user.name = req.body.name;
        }
        user.save(function (err, user) {
          if (err) console.log(err);
        });
        res.json(user);
      } else {
        res.json("No user found.");
      }
    });
  } else {
    res.json("Invalid user ID.");
  }
});

// Delete users.
router.delete('/delete/:userId', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var userId = req.params.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findOne({_id: userId})
    .then(user => {
      if (user) {
        User.deleteOne({
          _id: userId
        }, function (err) {
          if (err) console.log(err);
          res.json("user removed.");
        });
      } else {
        res.json("No user found.");
      }
    });
  } else {
    res.json("Invalid user ID.");
  }
});

// List folders & files in user home.
router.get('/home/:userId', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var homeFolderId = "";
  var userId = req.params.userId;
  if (userId) {
    Folder.findOne({userId: userId, name: "home"})
    .then(homeFolder => {
      if (homeFolder) {
        homeFolderId = homeFolder.id;
      }
      var homeItems = {};
      File.find({userId: userId, folderId: homeFolderId})
      .then(files => {
        homeItems.files = files;
        Folder.find({userId: userId, parentFolderId: homeFolderId})
        .then(folders => {
          homeItems.folders = folders;
          res.json(homeItems);
        });
      });
    });
  } else {
    res.json("No files found.");
  }
});

// List files/folders in a user folder.
router.get('/dir/:userId/:folderId', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var userId = req.params.userId;
  var folderId = req.params.folderId;
  if (userId) {
    var folderItems = {};
    File.find({userId: userId, folderId: folderId})
    .then(files => {
      folderItems.files = files;
      Folder.find({userId: userId, parentFolderId: folderId})
      .then(folders => {
        folderItems.folders = folders;
        res.json(folderItems);
      });
    });
  } else {
    res.json("No files found.");
  }
});

module.exports = router;