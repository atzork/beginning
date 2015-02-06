/**
 * Created by Zork on 2/2/15.
 */
var express = require('express');
var path    = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

var logger = require('morgan');

var allRoutes = require('./routes/all');
var routes = require('./routes/index');

var config = require('./config');

var sessionStore = require('./lib/sessionStore');

var pass = require('./lib/passport');
var passport = require('passport');

var app = express();

var server  = app.listen(config.get('server:port'),function(){
  console.log('Start ' + server.address().port);
});

app.set('views',path.join(__dirname,'views'));
//app.set('view engine','jade');

//app.set('view engine','html');
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
app.use(sessionStore);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'bower_components')));

app.use('*',allRoutes);
app.use('/',routes);

app.use(function(req,res,next){
  var message = config.get('errorStatus:http-404');
  res.status(404).send(message);
});
