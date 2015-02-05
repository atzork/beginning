/**
 * Created by sergey on 2/3/15.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user').User;

passport.serializeUser(function(user,done){
  console.log('serializeUser',arguments);
  done(null,user.id)
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    console.log('deserializeUser',arguments);
    done(err,user);
  });
});

passport.use(new LocalStrategy({usernameField:'email'},function(username,password,done) {
  console.log('LocalStrategy');
  User.findOne({login:username},function(err,user) {
    console.log('Искали пользователя по %s',username);
    if(err) {
      console.error('Ошибка получения пользователя %s',username,err);
      return done(err);
    }
    if(!user) {
      console.error('Не известный пользователь %s',username);
      return done(null,false,{message:'Не известный пользователь ' + username});
    }
    if(user.checkPassword(password)) {
      return done(null,user);
    } else {
      return done(null,false,{message:'Не верный пароль'});
    }
  })
}));