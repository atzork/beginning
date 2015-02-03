/**
 * Created by sergey on 2/3/15.
 */
var mongoose = require('mongoose');

var mongoOptions = {
  url: 'mongodb://localhost/beginning',
  other: {
    db: {safe: true}
  }
};

mongoose.connect(mongoOptions.url,mongoOptions.other,function(err,res){
  if(err){
    return console.error('Ошибка соединения:: ' + mongoOptions.url + '. ' + err);
  }
  console.log('Удачное соединение к::' + mongoOptions.url);
});

module.exports = mongoose;