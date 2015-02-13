/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = require('../oz.configs/env');
var _ = require('underscore');

router.get('/',function(req,res) {
  console.log('INDEX');
  res.render('index.html');
});
router.get('/index',function(req,res) {
  console.log('INDEX');
  res.render('index.html');
});

router.get('/login',function(req,res) {
  res.render('components/login/login.html');
});

router.get('/create-password/:id([0-9a-zA-Z]{1,32})',function(req,res,next) {
  var UserInst = require('../oz.models/user').UserInst;
  console.log(req.params.id);
  UserInst.getById(req.params.id,function(err,user){
    if(err){
      return next();
    }
    return res.render('components/createPassword/createPassword.html',{
      fio: user.fullName,
      firstName: user.firstName,
      email: user.email,
      _id: user._id
    });
  });
});

router.post('/create-password',function(req,res,next) {
  console.log('POST - /create-password', req.body);
  res.set({'Content-Type': 'application/json; charset=utf-8'});
  var UserInst = require('../oz.models/user').UserInst;
  UserInst.createPassword(req.body.id, 'staff', req.body.password, req.body.repassword, function (err, user) {
    if (err) {
      res
        .set(500)
        .send({
          typeError: 500,
          message: 'Server error'
        });
      return;
    }
    if (!user) {
      res
        .set(401)
        .send({
          typeError: config.get('errorStatus:userNotFound:typeError'),
          message: config.get('errorStatus:userNotFound:message')
        });
      return;
    }
    res
      .set(200)
      .send({status: 'ok'});
    return;
  });
});

router.get('/logout',function(req,res) {
  req.logout();
  req.session.messages = [];
  res.redirect('login.html');
});

router.post('/login', function(req,res,next){
  console.log('POST - login');
  setTimeout(function() { // <-- для визуализации иконки процесса загрузки
    passport.authenticate('local', function (err, user, info) {
      console.log('passport.authenticate', arguments);
      if (err) {
        console.error('Ошибка аутентификации!!!!');
        return next(err);
      }
      if (!user) {
        console.log(info.message);
        req.session.messages = [info];
        res
            .set({'Content-Type': 'application/json; charset=utf-8'})
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
          return next(err);
        }
        console.log('Получилось залогинится!! пользователь ', user);
        return res.redirect('/');
      })
    })(req, res, next)
  },4000);
});

module.exports = router;
