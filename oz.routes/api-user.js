var express = require('express');
var router = new express.Router();
var passport = require('passport');
var Auth = require('../oz.configs/auth').Auth;

module.exports.apiUserRouter = function apiUserRouter(app) {
  var config = app.get('config');
  var AuthInst = new Auth(app);
  AuthInst.setExclude(['/api/user/login', '/api/user/create-password']);

  router.use(AuthInst.action());

  router.all('*', function (req, res, next) {
    res.set({'Content-Type': 'application/json; charset=utf-8'});
    next();
  });

// get user info
  router.get('/get', function (req, res) {
    console.log('GET INIT USER');
    if (req.user) {
      res
        .send({
          success: true,
          data: {user: req.user},
          error: null
        });
    } else {
      res
        .set(404)
        .send({
          success: false,
          data: null,
          error: 'User not found'
        });
    }
  });

// LOGIN
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
              success: false,
              data: null,
              error: {
                typeError: 500,
                message: config.get('errorStatus:error-500')
              }
            });
          return;
        }
        if (!user) {
          console.log(info.message);
          req.session.messages = [info];
          res
            .status(401)
            .send({
              success: false,
              data: null,
              error: {
                typeError: info.type,
                message: info.message
              }
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
                success: false,
                data: null,
                error: {
                  typeError: 500,
                  message: config.get('errorStatus:error-500')
                }
              });
            return;
          }
          console.log('Получилось залогинится!! пользователь ', user);
          res
            .status(200)
            .send({success: true, data: {user: user}, error: null});
        });
      })(req, res, next);
    }, 4000);
  });

// edit user password
  router.post('/:type(edit|create)-password', function (req, res) {
    console.log('POST - /create-password');
    console.log('req.body:: ', req.body);
    res.set({'Content-Type': 'application/json; charset=utf-8'});
    //var userModel = require('../oz.models/user').userModel(app);
    //var UserInst = userModel.UserInst;
    var userModel = app.get('userModel');
    var userInst = userModel.userInst;
    userInst.createPassword(req.body.id, 'staff', req.body.password, req.body.repassword, function (err, user) {
      if (err) {
        res
          .set(500)
          .send({
            success: false,
            data: null,
            error: {
              typeError: 500,
              message: 'Server error'
            }
          });
        return;
      }
      if (!user) {
        res
          .set(401)
          .send({
            success: false,
            data: null,
            error: {
              typeError: config.get('errorStatus:userNotFound:typeError'),
              message: config.get('errorStatus:userNotFound:message')
            }
          });
        return;
      }
      res
        .set(200)
        .send({success: true, data: true, error: null});
    });
  });

  return router;
};
