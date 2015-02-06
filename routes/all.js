/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router = express.Router();

router.all('*',_auforization,function(req,res,next){
  next();
});

function _auforization(req,res,next){
  var exeptUrl = ['/login','/registration','/favicon.ico','/create-password'];
  res.set({
    'Content-Type': 'text/html; charset=utf-8'
  });

  //if(!req.session.user && (exeptUrl.indexOf(req.originalUrl)<0)){

  if(!req.user && (exeptUrl.indexOf(req.originalUrl)<0)){
    console.error('Не авторизированный пользователь');
    return res.redirect('/login');
  } else {
    return next();
  }
}

module.exports = router;
