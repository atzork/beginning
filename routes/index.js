/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/',function(req,res) {
  res.render('index');
});

router.get('/login',function(req,res) {
  console.log(req.body);
  res.render('login');
});

router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/login');
});

router.post('/login', function(req,res,next){
  console.log('POST - login');
  passport.authenticate('local',function(err,user,info){
    console.log('passport.authenticate',arguments);
    if(err){
      console.error('Ошибка аутентификации!!!!');
      return next(err);
    }
    if(!user){
      console.log('Не известный пользователь!!!');
      req.session.messages = [info.message];
      return res.redirect('/login');
    }
    console.log('Производим Логин..');
    req.logIn(user,function(err) {
      if(err){
        console.log('Ошибка фукнции logIn()');
        return next(err);
      }
      console.log('Получилось залогинится!! пользователь ',user);
      return res.redirect('/');
    })
  })(req,res,next);
});

module.exports = router;
