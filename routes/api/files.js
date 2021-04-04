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
    File.find(search)
    .then(files => {
      res.json(files);
    });
  } else {
    res.json("No files found.");
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
    res.json("File saved.");
  });
});

// Edit file.
router.post('/edit/:userId/:fileId', function(req, res, next) {
  var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var fileId = req.params.fileId;
  if (mongoose.Types.ObjectId.isValid(fileId)) {
    File.findOne({_id: fileId})
    .then(file => {
      if (file) {
        var fileUserId = file.userId;
        if (fileUserId != req.params.userId) {
          res.json("This user is not authorized to edit the given file.");
        } else {
          if (req.body.name) {
            file.name = req.body.name;
          }
          if (req.body.folderId) {
            file.folderId = req.body.folderId;
          }
          if (req.body.content) {
            file.content = req.body.content;
          }
          file.save(function (err, file) {
            if (err) console.log(err);
          });
          res.json(file);        
        }

      } else {
        res.json("No file found.");
      }
    });
  } else {
    res.json("Invalid file ID.");
  }
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
    res.json("File removed.");
  });
});

module.exports = router;