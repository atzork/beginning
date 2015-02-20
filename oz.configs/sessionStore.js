/**
 * Created by sergey on 2/2/15.
 */
var config = require('./env');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var sessionStore = new RedisStore(config.get('db:redis:option'));
var sessionInst = session({
  store: sessionStore,
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  maxAge: config.get('session:maxAge'),
  resave: config.get('session:resave'),
  saveUninitialized: config.get('session:saveUninitialized')
});

module.exports = sessionInst;
