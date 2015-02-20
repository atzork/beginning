/**
 * Created by sergey on 2/5/15.
 */
var nconf = require('nconf');
var path = require('path');

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

module.exports = nconf;