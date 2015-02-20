/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router = new express.Router();

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

module.exports = router;
