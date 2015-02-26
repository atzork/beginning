/**
 * Created by sergey on 2/13/15.
 */
module.exports = (function() {
  var express = require('express');
  var router = new express.Router();
  var auth = require('../oz.configs/auth');

  router.use(auth(['/api/login', '/api/create-password']));

  router.get('/login', function (req, res) {
    res.render('components/login/login.html');
  });

  router.get('/:type(create|edit)-password/:id([0-9a-zA-Z]{24})', function (req, res, next) {
    var UserInst = require('../oz.models/user').UserInst;
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

  return router;
})();
