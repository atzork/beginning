/**
 * Created by sergey on 2/2/15.
 */
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function sessionInst(app) {
  var config = app.get('config');
  var sessionStore = new RedisStore(config.get('db:redis:option'));
  var sessionInst = session({
    store: sessionStore,
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    maxAge: config.get('session:maxAge'),
    resave: config.get('session:resave'),
    saveUninitialized: config.get('session:saveUninitialized')
  });
  return sessionInst;
};
//module.exports = sessionInst;
