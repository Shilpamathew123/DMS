/*
 * The users api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");
var bcrypt   = require('bcrypt');
var commons  = require('../../lib');
var config   = require('../../config');
var User     = require('../../models/user');
var Folder   = require('../../models/folder');
var File     = require('../../models/file');

// List users.
router.get('/', function(req, res, next) {
  commons.connectDb("secondaryPreferred");
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
  commons.connectDb("secondaryPreferred");
  var name = req.body.name;
  User.find({name: name})
  .then(user => {
    if (user.length > 0) {
      res.json("User with this name exists.");
    } else {
      var newUser = new User({
        name: name,
        pass: bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync())
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
  commons.connectDb("secondaryPreferred");
  var userId = req.params.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findOne({_id: userId})
    .then(user => {
      if (user) {
        if (req.body.name) {
          user.name = req.body.name;
        }
        if (req.body.pass) {
          user.pass = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync());
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
  commons.connectDb("secondaryPreferred");
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
  commons.connectDb("primaryPreferred");
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
  commons.connectDb("primaryPreferred");
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

// Login user.
router.post('/login/:userId', function(req, res, next) {
  commons.connectDb("secondaryPreferred");
  var userId = req.params.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findOne({_id: userId})
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.pass, user.pass)) {
          user.pass = "****";
          res.json(user);
        } else {
          res.json("Unable to authenticate. Invalid user or password.");
        }
      } else {
        res.json("No user found.");
      }
    });
  } else {
    res.json("Invalid user ID.");
  }
});

module.exports = router;