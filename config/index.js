/**
 * Created by sergey on 2/5/15.
 */
var nconf = require('nconf');
var path = require('path');

console.log('1111');

nconf
  .argv()
  .env()
  .file('common',path.join(__dirname, '/config.json'))
  .file('local',path.join(__dirname, 'config-local.json'));

module.exports = nconf;