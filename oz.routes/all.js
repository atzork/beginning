/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router = express.Router();

router.all('*',_auforization,_isAjaxReq,function(req,res,next){
  next();
});

function _auforization(req,res,next){
  var exeptUrl  = ['/index','/login','/create-password','/registration','/favicon.ico','/api/login','/api/registration','/api/create-password'];
  var maxExpUrl = exeptUrl.length;
  var regexp    = /^.$/;
  var resolve   = false;
  res.set({
    'Content-Type': 'text/html; charset=utf-8'
  });

  //console.log('Урл на входе:: ', req.originalUrl);
  if(exeptUrl.indexOf(req.originalUrl)<0) {
    for (var i = 0; i < maxExpUrl; i += 1) {
      regexp = new RegExp('^' + exeptUrl[i] + '.*', 'i');
      //console.log('Проверем:: ',exeptUrl[i]);
      //console.log('regexp:: ',regexp);
      if (regexp.test(req.originalUrl)) {
        resolve = true;
        break;
      }
    }
  } else {
    resolve = true;
  }

  //console.log('Разрешено ли? ',resolve);
  //console.log('начинаем проверку:: ',req.originalUrl);
  if(!req.user && !resolve){
    console.error('Не авторизированный пользователь');
    return res.redirect('/login');
  } else {
    return next();
  }
} // _auforization()

function _isAjaxReq(req,res,next) {
  console.log('---------- проверка на AJAX ----------');
  console.log(req.originalUrl);
  console.log('Ajax? ::',req.xhr);
  console.log('======================================');
  return next();
}

module.exports = router;
