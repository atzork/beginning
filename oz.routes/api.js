/**
 * Created by sergey on 2/13/15.
 */
var router = require('express').Router();

// -----
// Login

// view
router.get('/login',function(req,res) {
  res.render('components/login/login.html');
});

// server action
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

// Login END
// =========

// ---------------
// Create password

// view
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

// server action
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

// Create password END
// ===================

module.exports = router;