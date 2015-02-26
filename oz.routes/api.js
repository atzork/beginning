/**
 * Created by sergey on 2/13/15.
 */
var express = require('express');
var router = new express.Router();
// -----
// Login

// view
router.get('/login', function (req, res) {
  res.render('components/login/login.html');
});

// ---------------
// Create password

// view
router.get('/create-password/:id([0-9a-zA-Z]{1,32})', function (req, res, next) {
  var UserInst = require('../oz.models/user').UserInst;
  console.log(req.params.id);
  UserInst.getById(req.params.id, function (err, user) {
    if (err || !user) {
      return next();
    }
    return res.render('components/createPassword/createPassword.html', {
      fio: user.fullName,
      firstName: user.firstName,
      email: user.email,
      _id: user._id
    });
  });
});

// server action

// Create password END
// ===================

module.exports = router;