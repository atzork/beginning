var express = require('express');
var router = new express.Router();
var Auth = require('../oz.configs/auth').Auth;

module.exports.indexRouter = function indexRouter(app) {
  var AuthInst = new Auth(app);
  router.use(AuthInst.action());
  AuthInst.setExclude(['/login', '/registration']);

  router.get('/', function (req, res) {
    console.log('INDEX');
    res.render('index.html');
  });
  router.get('/index', function (req, res) {
    console.log('INDEX');
    res.render('index.html');
  });

  router.get('/logout', function (req, res) {
    req.logout();
    req.session.messages = [];
    res.redirect('login');
  });

  return router;
};
