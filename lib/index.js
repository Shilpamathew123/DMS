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
  },

  log: function (string) {
    if(app.get('env') === "development") {
      console.log(string);
    }
  },

  isAuthenticated: function(req) {
    if(req.session.user && req.cookies.user_sid) {
      return true;
    }
    return false;
  },

  render: function (req, res, page, params) {
    params.authenticated = this.isAuthenticated(req);
    res.render(page, params);
  },

  getHomePageByUser: function(user) {
    if(user.is_admin) {
      return {page: 'admins', params: {title: 'Admin home', data: 'Admins stuff.'}};      
    } else {
      return {page: 'users', params: {title: 'User home', data: 'Users stuff.'}};
    }
  }
};

module.exports = commons;