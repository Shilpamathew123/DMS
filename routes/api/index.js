/*
 * The api home page.
 */

var express  = require('express');

var commons  = require('../../lib');
var config   = require('../../config');

var homeApiRouter  = require('./home');
var filesApiRouter = require('./files');
var usersApiRouter = require('./users');

var app = express();

app.use('/', homeApiRouter);
app.use('/files', filesApiRouter);
app.use('/users', usersApiRouter);

module.exports = app;