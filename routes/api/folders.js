/*
 * The folders api.
 */

var express  = require('express');
var router   = express.Router();
var mongoose = require("mongoose");

var commons  = require('../../lib');
var config   = require('../../config');
var Folder   = require('../../models/folder');

// List files
router.get('/', function(req, res, next) {
  var constr = config.getDbCon();
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  Folder.find()
  .then(folders => {
    res.send(folders);
  });
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
    res.send("Folder saved.");
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
    res.send("Folder removed.");
  });
});

module.exports = router;