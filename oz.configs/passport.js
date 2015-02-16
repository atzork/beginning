/**
 * Created by sergey on 2/3/15.
 */
var passport = require('passport');
var config = require('./env');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../oz.models/user').User;

passport.serializeUser(function(user,done){
  done(null,user.id)
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    if(err){
      console.error('DeserializeUser failed:: ',err);
    }
    if(!user){
      console.error('User empty after DeserializeUser', user);
    }
    done(err,user);
  });
});

passport.use(new LocalStrategy({usernameField:'email'},function(email,password,done) {
  console.log('LocalStrategy');
  User.findOne({email:email},function(err,user) {
    console.log('Искали пользователя по %s',email);
    if(err) {
      console.error('Ошибка получения пользователя %s',email,err);
      return done(err);
    }
    if(!user) {
      console.error('Не известный пользователь %s',email);
      return done(null,false,{type: config.get('errorStatus:emailNotFound:typeError'),message:config.get('errorStatus:emailNotFound:message').replace('%s',email)});
    }
    console.log('Найден пользователь:: ',email);
    if(user.checkPassword(password)) {
      return done(null,user);
    } else {
      return done(null,false,{type: config.get('errorStatus:wrongPassword:typeError'),message:config.get('errorStatus:wrongPassword:message')});
    }
  })
}));