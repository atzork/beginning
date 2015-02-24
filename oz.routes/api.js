/**
 * Created by sergey on 2/13/15.
 */
var express = require('express');
var router = new express.Router();
var passport = require('passport');
var config = require('../oz.configs/env');
// -----
// Login

// view
router.get('/login', function (req, res) {
  res.render('components/login/login.html');
});

// server action
router.post('/login', function (req, res, next) {
  console.log('POST - login');
  setTimeout(function () { // <-- для визуализации иконки процесса загрузки
    passport.authenticate('local', function (err, user, info) {
      console.log('passport.authenticate', arguments);
      res.set({'Content-Type': 'application/json; charset=utf-8'});
      if (err) {
        console.error('Ошибка аутентификации!!!!');
        res
          .status(500)
          .send({
            typeError: 500,
            message: config.get('errorStatus:error-500')
          });
        return;
      }
      if (!user) {
        console.log(info.message);
        req.session.messages = [info];
        res
          .status(401)
          .send({
            typeError: info.type,
            message: info.message
          });
        return;
      }
      console.log('Производим Логин..');
      req.logIn(user, function (err) {
        if (err) {
          console.log('Ошибка фукнции logIn()');
          res
            .status(500)
            .send({
              typeError: 500,
              message: config.get('errorStatus:error-500')
            });
          return;
        }
        console.log('Получилось залогинится!! пользователь ', user);
        res
          .status(200)
          .send({status: '0k'});
        return;
      });
    })(req, res, next);
  }, 4000);
});

// Login END
// =========

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