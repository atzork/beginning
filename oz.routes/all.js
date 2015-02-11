/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router = express.Router();

router.all('*',_auforization,function(req,res,next){
  next();
});

function _auforization(req,res,next){
  var exeptUrl  = ['/login','/registration','/favicon.ico','/create-password'];
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
    return res.redirect('components/login/login.html');
  } else {
    return next();
  }
}

module.exports = router;
