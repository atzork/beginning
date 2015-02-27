/**
 * Created by sergey on 2/3/15.
 */
var mongoose = require('mongoose');

module.exports.mongooseConnect = function mongooseConnect(app) {
  var config = app.get('config');

  mongoose.connect(config.get('db:mongodb:url'), config.get('db:mongodb:option'), function (err) {
    if (err) {
      return console.error('Ошибка соединения:: ' + config.get('db:mongodb:url') + '. ' + err);
    }
    console.log('Удачное соединение к::' + config.get('db:mongodb:url'));
  });

  app.set('mongoose', mongoose);

  return mongoose;
};
