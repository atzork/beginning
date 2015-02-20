/**
 * Created by Zork on 08.02.2015.
 */
var config = require('./env');
var redisConfig = config.get('db:redis');

var redis = require('redis').createClient(redisConfig.port, redisConfig.host, redisConfig.option);
redis.select(redisConfig.option.db, function (err) {
  if (err) {
    return console.error(config.get('errorStatus:redisFaultConnect:message'), redisConfig.option.db);
  }
  console.log('Redis connect success to ', redisConfig.option.db);
});

module.exports = redis;
