var express = require('express');
var router = new express.Router();
var Auth = require('../oz.configs/auth').Auth;

module.exports.apiRouter = function apiRouter(app) {
  var AuthInst = new Auth(app);
  AuthInst.setExclude(['/api/dashboard', '/api/login', '/api/create-password']);
  router.use(AuthInst.action());

  router.get('/login', function (req, res) {
    res.render('components/login/login.html');
  });

  router.get('/:type(create|edit)-password/:id([0-9a-zA-Z]{24})', function (req, res, next) {
    console.log(req.originalUrl);
    //var userModel = require('../oz.models/user').userModel(app);
    var userModel = app.get('userModel');
    console.log('userModel:; ', userModel);
    var userInst = userModel.userInst;
    userInst.getById(req.params.id, function (err, user) {
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

  return router;
};
