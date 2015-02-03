/**
 * Created by sergey on 2/3/15.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user').User;

passport.serializeUser(function(user,done){
  done(null,user.id)
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});

passport.use(new LocalStrategy(function(login,password,done) {
  User.findOne({login:login},function(err,user) {
    if(err) {
      console.error('Ошибка получения пользователя %s',login,err);
      return done(err);
    }
    if(!user) {
      console.error('Не известный пользователь %s',login);
      return done(null,false,{message:'Не известный пользователь ' + login});
    }
    if(user.checkPassword(password)) {
      return done(null,user);
    } else {
      return done(null,false,{message:'Не верный пароль'});
    }
  })
}));