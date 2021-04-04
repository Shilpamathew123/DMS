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
  if (userId) {
    Folder.find({userId: userId})
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

  var newFolder = new Folder({
    name: req.body.name,
    userId: req.body.userId,
    parentFolderId: req.body.parentFolderId
  });
  newFolder.save(function (err) {
    if (err) console.log(err);
    res.json("Folder saved.");
  });
});

// Delete folder.
router.delete('/delete', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  Folder.deleteOne({
    name: req.body.name
  }, function (err) {
    if (err) console.log(err);
    res.json("Folder removed.");
  });
});

module.exports = router;