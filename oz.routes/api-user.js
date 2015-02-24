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

router.post('/edit-password', function (req, res) {
  console.log('POST - /create-password');
  console.log('req.body:: ', req.body);
  res.set({'Content-Type': 'application/json; charset=utf-8'});
  var UserInst = require('../oz.models/user').UserInst;
  UserInst.createPassword(req.body.id, 'staff', req.body.password, req.body.repassword, function (err, user) {
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
    return;
  });
});

module.exports = router;
