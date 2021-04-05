/*
 * The folders api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");

var commons  = require('../../lib');
var config   = require('../../config');
var Folder   = require('../../models/folder');

// List folders.
router.get('/', function(req, res, next) {
  res.json("Please specify a user ID.");
});
router.get('/:userId', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  var userId = req.params.userId;
  var search = {};
  if (userId) {
    search.userId = userId;
    if (req.query.name) {
      search.name = req.query.name;
    }
    Folder.find(search)
    .then(folders => {
      res.json(folders);
    });
  } else {
    res.json("No folders found.");
  }
});

// Add new folder.
router.post('/add', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var name = req.body.name;
  if (name == "home") {
    res.json("Invalid folder name:'home'");
  } else {
    var newFolder = new Folder({
      name: name,
      userId: req.body.userId,
      parentFolderId: req.body.parentFolderId
    });
    newFolder.save(function (err) {
      if (err) console.log(err);
      res.json("Folder saved.");
    });    
  }

});

// Edit folder.
router.post('/edit/:userId/:folderId', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var folderId = req.params.folderId;
  if (mongoose.Types.ObjectId.isValid(folderId)) {
    Folder.findOne({_id: folderId})
    .then(folder => {
      if (folder) {
        var folderUserId = folder.userId;
        if (folderUserId != req.params.userId) {
          res.json("This user is not authorized to edit the given folder.");
        } else {
          if (req.body.name) {
            folder.name = req.body.name;
          }
          // Changing parentFolderId is equivalent to moving the folder to another folder.
          if (req.body.parentFolderId) {
            folder.parentFolderId = req.body.parentFolderId;
          }
          folder.save(function (err, folder) {
            if (err) console.log(err);
          });
          res.json(folder);        
        }

      } else {
        res.json("No folder found.");
      }
    });
  } else {
    res.json("Invalid folder ID.");
  }
});

// Delete folder.
router.delete('/delete/:userId/:folderId', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var folderId = req.params.folderId;
  if (mongoose.Types.ObjectId.isValid(folderId)) {
    Folder.findOne({_id: folderId})
    .then(folder => {
      if (folder) {
        var folderUserId = folder.userId;
        if (folderUserId != req.params.userId) {
          res.json("This user is not authorized to delete the given folder.");
        } else {
          Folder.deleteOne({
            _id: folderId
          }, function (err) {
            if (err) console.log(err);
            res.json("Folder removed.");
          });
        }
      } else {
        res.json("No folder found.");
      }
    });
  } else {
    res.json("Invalid folder ID.");
  }
});

module.exports = router;