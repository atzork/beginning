/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = require('../oz.configs/env');
var _ = require('underscore');

router.get('/',function(req,res) {
  res.render('components/index');
});

router.get('/login',function(req,res) {
  res.render('components/login/login.html');
});
router.get('/create-password/:id([0-9a-zA-Z]{1,32})',function(req,res,next) {

  console.log('ТЕСТ Undescore:: ', _.isNumber(1));
  console.log('ТЕСТ Undescore:: ', _.isNumber("1"));
  console.log('ТЕСТ Undescore:: ', _.isNumber("dkjk"));

  var UserInst = require('../oz.models/user').UserInst;

  // тестим использование virtual-полей
  var User = require('../oz.models/user').User;
  User.findById(req.params.id,function(err,user){
    console.log(arguments);
    console.log('password: ',user.password);
    console.log('fullName: ',user.fullName);
    console.log('salt: ',user.salt);

    user.update({$set:{password:'zzz2'}},function(err,affected){
      console.log('Пробуем апдейтить');
      console.log(arguments);
    });

    //user.password = 'pas2';
    console.log('password: ',user.password);
    console.log('user: ',user);

    return res.render('components/createPassword/createPassword.html',{fio:user.fullName,firstName:user.firstName,email:user.email});
  });

  /*
  UserInst.getById(req.params.id,function(err,user){
    if(err || !user){
      return next();
    }
    console.log('Получен пользователь:: ',user);
    return res.render('components/createPassword.html',{fio:user.fullName,firstName:user.firstName,email:user.email});
  });
  */
  //return res.render('components/createPassword.html',{fio:user.fullName,firstName:user.firstName,email:user.email});

});

router.post('/create-password',function(req,res,next) {
  console.log('POST - /create-password', req.body);
  //var UserInst = require('../oz.models/user').UserInst;

  //UserInst.selectData(function(err,user){
  //  if(!err){
  //
  //  }
  //},{email:req.body.email});

  var User = require('../oz.models/user').User;
  User.update({email:req.body.email},{$set:{password:req.body.password}},function(){
    console.log('User.update:: ',arguments);
    return res.send({status:'ok'});
  });

  //UserInst.updateData(done,{email:req.body.email},{$set:{password:req.body.password}});
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
});

router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/components/login/login.html');
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
