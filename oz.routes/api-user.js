/**
 * Created by sergey on 2/23/15.
 */
var express = require('express');
var router = new express.Router();
var config = require('../oz.configs/env');

router.all('*', function(req, res, next) {
  res.set({'Content-Type': 'application/json; charset=utf-8'});
  next();
});

router.get('/get', function(req, res) {
  console.log('GET INIT USER');
  if (req.user) {
    res
      .send({
        success: true,
        data: req.user,
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
  return;
});

module.exports = router;
