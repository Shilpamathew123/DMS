/*
 * The files api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");

var commons  = require('../../lib');
var config   = require('../../config');
var File     = require('../../models/file');

// List files
router.get('/', function(req, res, next) {
  res.send("Please specify a user ID.");
});
router.get('/:userId', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  var userId = req.params.userId;
  if (userId) {
    File.find({userId: userId})
    .then(files => {
      res.send(files);
    });
  } else {
    res.send("No files found.");
  }
});

// Add new file.
router.post('/add', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var newFile = new File({
    name: req.body.name,
    folderId: req.body.folderId,
    userId: req.body.userId,
    content: req.body.content
  });
  newFile.save(function (err) {
    if (err) console.log(err);
    res.send("File saved.");
  });
});

// Delete file.
router.delete('/delete', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  File.deleteOne({
    name: req.body.name
  }, function (err) {
    if (err) console.log(err);
    res.send("File removed.");
  });
});

module.exports = router;