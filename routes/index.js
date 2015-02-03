/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var router = express.Router();

//passport.use(new LocalStrategy(
//  function(username, password, done){
//
//  }
//))

router.get('/login',function(req,res) {
  res.render('login');
});

router.post('/login',function(req,res,next){
  passport.authenticate('local',function(err,user,info){
    if(err){
      return next(err);
    }
    if(!user){
      req.session.messages = [info.message];
      return res.redirect('/login');
    }
    req.logIn(user,function(err) {
      if(err){
        return next(err);
      }
      return res.redirect('/');
    })
  })(req,res,next);
});


router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/login');
});

//router.post('/login',
//  passport.authenticate('local',{
//    successRedirect: '/',
//    failureRedirect: '/login'
//  })
//);

router.get('/',function(req,res) {
  res.render('index');
});

module.exports = router;