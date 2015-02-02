/**
 * Created by sergey on 2/2/15.
 */
var config = require('../config/config.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({
  host: 'localhost',
  port: 27017,
  db: 'beginning',
  autoReconect: true
});

var sessionInst = session({
  store: sessionStore,
  secret: 'Zork',
  saveUninitialized: true,
  resave:true,
  key: 'Zork-key',
  maxAge: 86400
});

module.exports = sessionInst;
