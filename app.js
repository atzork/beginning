/**
 * Created by Zork on 2/2/15.
 */
'use strict';
var express = require('express');
var app = express();

require('./oz.configs/env').configInit(app);
require('./oz.configs/mongoose').mongooseConnect(app);
require('./oz.configs/redisConnect').redisConnect(app);

require('./oz.models/user').userModel(app);

require('./oz.configs/passport').passportInit(app);

var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

var logger = require('morgan');

var apiRoutes = require('./oz.routes/api').apiRouter(app);
var apiUser = require('./oz.routes/api-user').apiUserRouter(app);
var routes = require('./oz.routes/index').indexRouter(app);

var sessionStore = require('./oz.configs/sessionStore')(app);

var passport = app.get('passport');
var config = app.get('config');

var server = app.listen(config.get('server:port'), function () {
  console.log('Start ' + server.address().port);
});

app.set('views', path.join(__dirname, 'oz.public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, config.get('favIcon'))));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(sessionStore);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'oz.public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/api/user', apiUser);
app.use('/api', apiRoutes);
app.use('/', routes);

app.use(function (req, res) {
  res.render('index.html');
});
