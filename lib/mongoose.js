/**
 * Created by sergey on 2/3/15.
 */
var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.get('db:mongodb:url'),config.get('db:mongodb:option'),function(err,res){
  if(err){
    return console.error('Ошибка соединения:: ' + config.get('db:mongodb:url') + '. ' + err);
  }
  console.log('Удачное соединение к::' + config.get('db:mongodb:url'));
});

module.exports = mongoose;