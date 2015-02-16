/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = require('../oz.configs/env');
//var _ = require('underscore'); loudashe

router.get('/',function(req,res) {
  console.log('INDEX');
  res.render('index.html');
});
router.get('/index',function(req,res) {
  console.log('INDEX');
  res.render('index.html');
});

router.get('/logout',function(req,res) {
  req.logout();
  req.session.messages = [];
  res.redirect('login');
});

module.exports = router;
