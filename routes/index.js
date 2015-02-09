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
router.get('/create-password/:id([0-9a-zA-Z]{1,32})',function(req,res,next) {
  var UserInst = require('../model/user').UserInst;
  UserInst.getById(req.params.id,function(err,user){
    if(err || !user){
      return next();
    }
    console.log('Получен пользователь:: ',user);
    return res.render('create-password.html',{fio:user.fullName,firstName:user.firstName,email:user.email});
  });
});
                                                
router.post('/create-password',function(req,res,next) {
  console.log('POST - /create-password');
  setTimeout(function(){  // <-- для визуализации иконки процесса загрузки
    var UserInst = require('../model/user').UserInst;



    UserInst.updateData(done,{email:req.body.email},{$set:{password:req.body.password}});
    //UserInst.updateData(done,{email:req.body.email},{$set:{salt:req.body.password}});
    function done(err,affected){
      if(err){
        return next(err);
      }
      res.set({'Content-Type': 'application/json; charset=utf-8'});
      if(!affected){
        console.log('Неизвестный пользователь');
        res
          .status(401)
          .send({
            typeError : config.get('errorStatus:emailNotFound:typeError'),
            message   : config.get('errorStatus:emailNotFound:message').replace('%s'.req.body.email)
          });
      }
      console.log('Результат генерации пароля:: ',affected);
      return res.send({status:'ok'});
    }
  })
});

router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/login');
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
