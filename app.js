/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var connect = require('connect');
var path    = require("path");

var routes = require('./routes/index');
var allRoutes = require('./routes/all');

var config = require('./config/config');
var sessionStore = require('./lib/sessionStore');
var app = express();

var server  = app.listen(3000,function(){
  console.log('Start ' + server.address().port);
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//app.set('view engine','html');

app.use(sessionStore);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'bower_components')));


app.use('*',allRoutes);
app.use('/',routes);

app.use(function(req,res,next){
  var message = 'Страница не найдена(';

  res.send(message,404);
});