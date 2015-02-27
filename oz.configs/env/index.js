var nconf = require('nconf');
var path = require('path');

module.exports.configInit = function configInit(app) {
  nconf
    .argv()
    .env()
    .file('common', path.join(__dirname, 'config.json'))
    .file('local', path.join(__dirname, 'config-local.json'));

  if (!nconf.get('config-common-enabled')) {
    throw '<<config-common>> is not found!!';
  }
  if (!nconf.get('local-config-enabled')) {
    throw '<<config-local>> is not found!!';
  }

  app.set('config', nconf);
};