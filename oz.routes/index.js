/**
 * Created by sergey on 2/2/15.
 */
module.exports = (function() {
  var express = require('express');
  var router = new express.Router();
  var auth = require('../oz.configs/auth');

  router.use(auth());

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
})();
