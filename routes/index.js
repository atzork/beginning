/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = require('../config');

router.get('/',function(req,res) {
  res.render('index');
});

router.get('/login',function(req,res) {
  res.render('login.html');
});
router.get('/create-password',function(req,res) {
  //res.render('create-password',{fio:'Вася Пупкин',firstName:'Вася',email:'zz@zz.zz'});
  res.render('create-password.html',{fio:'Вася Пупкин',firstName:'Вася',email:'zz@zz.zz'});
});

router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/login');
});

router.post('/login', function(req,res,next){
  console.log('POST - login');
  setTimeout(function() {
    passport.authenticate('local', function (err, user, info) {
      console.log('passport.authenticate', arguments);
      if (err) {
        console.error('Ошибка аутентификации!!!!');
        return next(err);
      }
      if (!user) {
        console.log('Не известный пользователь!!!');
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
