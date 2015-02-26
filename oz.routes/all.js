/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router;
router = new express.Router();

router.all('*', _auforization, _isAjaxReq, function (req, res, next) {
  next();
});

function _auforization(req, res, next) {
  var exeptUrl = [
    '/index',
    '/dashboard',
    '/login',
    '/api/login',
    '/registration',
    '/api/registration',
    '/favicon.ico',
    '/api/user/registration',
    '/api/user/login',
    '/api/user/get',
    '/api/user/edit-password'
  ];
  var maxExpUrl = exeptUrl.length;
  var regexp = /^.$/;
  var resolve = false;
  res.set({
    'Content-Type': 'text/html; charset=utf-8'
  });

  //console.log('Урл на входе:: ', req.originalUrl);
  if (exeptUrl.indexOf(req.originalUrl) < 0) {
    for (var i = 0; i < maxExpUrl; i += 1) {
      regexp = new RegExp('^' + exeptUrl[i] + '/?.*', 'i');
      //console.log('Проверем:: ',exeptUrl[i]);
      //console.log('regexp:: ',regexp);
      if (regexp.test(req.originalUrl)) {
        //console.log('тест пройден!!');
        resolve = true;
        break;
      }
    }
  } else {
    //console.log('Совпал урл (%s) :: ',req.originalUrl ,exeptUrl.indexOf(req.originalUrl));
    resolve = true;
  }

  //console.log('Разрешено ли? ',resolve);
  //console.log('начинаем проверку:: ',req.originalUrl);
  //console.log('!req.user:: ', !req.user);
  //console.log('!resolve:: ', !resolve);
  if (!req.user && !resolve) {
    console.error('Не авторизированный пользователь');
    return res.redirect('/login');
  }
  return next();
} // _auforization()

function _isAjaxReq(req, res, next) {
  console.log('---------- проверка на AJAX ----------');
  console.log(req.originalUrl);
  console.log('Ajax? ::', req.xhr);
  console.log('======================================');
  return next();
}

module.exports = router;
