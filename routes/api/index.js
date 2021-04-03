/*
 * The admin page.
 */

var express  = require('express');
var router   = express.Router();
// var bcrypt  = require('bcrypt');
var mongoose = require("mongoose");
var commons  = require('../../lib');
var config   = require('../../config');
var User     = require('../../models/user');

var validateAdmin = (req, res, next) => {
  if(commons.isAuthenticated(req) && req.session.user.is_admin) {
    next();
  } else {
    res.redirect("/");
  }    
};
// Validate admin
// router.use('/*', validateAdmin);

// GET admin dashboard.
router.get('/', function(req, res, next) {
  console.log(process.env.DB_USER);
  var constr = config.getDbCon();
  console.log(constr);
  var client = mongoose.connect(constr, { useNewUrlParser: true, useUnifiedTopology: true });
  //Get the default connection
  var db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));


  // Create an instance of model SomeModel
  var new_user = new User({ userName: 'awesome' });

  // Save the new model instance, passing a callback
  // new_user.save(function (err) {
  //   if (err) return handleError(err);
  //   // saved!
  // });

  User.find()
  .then(users => {
    console.log(users);
    res.send(users);
  });
  // var goto = commons.getHomePageByUser(req.session.user);
  // commons.render(req, res, goto.page, goto.params);
});

// List users
router.get('/list/users', function(req, res) {
  User.findAll({
    attributes: ['id', 'first_name', 'last_name', 'username','email']
  })
  .then(users => {
    commons.render(req, res, 'admins/list_users', {title: "list", data: users});
  });
});

// Add users.
router.post('/add/users', function(req, res) {
  var goTo = commons.getHomePageByUser(req.session.user);
  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  })
  .then(user => {
    commons.log("Created user");
    goTo.params.status = "Created new user";
    commons.render(req, res, goTo.page, goTo.params);
  })
  .catch(error => {
    commons.log("Error in creating user");
    goTo.params.status = "Error in creating user";
    commons.render(req, res, goTo.page, goTo.params);
  });
});

// GET edit users.
router.get('/edit/users/:id', function(req, res) {
  var goTo = commons.getHomePageByUser(req.session.user);
  User.findOne({ where: { id: req.params.id } }).then(function (user) {
    if (!user) {
      res.redirect('/');
    } else {
      commons.render(req, res, 'admins/edit_users', {title: "edit", data: user});
    }
  });
});

// POST edit users.
router.post('/edit/users', function(req, res) {
  var goTo = commons.getHomePageByUser(req.session.user);
  var updateData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };
  if(req.body.password) {
    updateData.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
  }
  var whereData = {
    where: {id: req.body.id}
  };
  User.update(updateData, whereData)
  .then(function(rowsUpdated) {
    commons.log("Updated user");
    goTo.params.status = "Updated the user";
    commons.render(req, res, goTo.page, goTo.params);
  })
  .catch(error => {
    commons.log("Error in updating user");
    goTo.params.status = "Error in updating user";
    commons.render(req, res, goTo.page, goTo.params);
  });
});

module.exports = router;