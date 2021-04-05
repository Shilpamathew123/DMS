/*
 * A file for common functions.
 */
var express  = require('express');
var app      = express();
var mongoose = require("mongoose");
var config   = require('../config');

var commons = {
  // Normalize a port into a number, string, or false.
  normalizePort : function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      return val; // named pipe
    }
    if (port >= 0) {
      return port; // port number
    }
    return false;
  },

  getDb: function () {
    var client = mongoose.connect(config.getDbCon(), { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    return db;
  }
};

module.exports = commons;