/*
 * A file for common functions.
 */
var express = require('express');
var app = express();

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
  }
};

module.exports = commons;