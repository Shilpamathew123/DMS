// Module dependencies.

var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var createError  = require('http-errors');
var cookieParser = require('cookie-parser');
var mongoose     = require("mongoose");
const basicAuth  = require('express-basic-auth');

var config       = require('./config');
var commons      = require('./lib');
var indexRouter  = require('./routes');
var apiRouter    = require('./routes/api');

var app = express();

var appMode = process.env.DEPLOYMENT_MODE || 'development';
app.set('env', appMode);
var loggerMode = (appMode==='development') ? 'dev' : 'combined';
app.set('logger-mode', loggerMode);
app.use(logger(app.get('logger-mode') || 'dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const apiPass = process.env.API_PASS;
app.use(basicAuth({
  users: { 'api_user' : apiPass },
  challenge: true
}));

// Route requests to pages.
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(err) {
    console.error(res.locals.message);
    console.error(res.locals.error);
  }
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
