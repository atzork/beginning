/**
 * Created by Zork on 08.02.2015.
 */

var mongoose= require('../lib/mongoose');
var config  = require('../config');
var redis   = require('../lib/redisConnect');

var redisConfig = config.get('db:redis');

var DbModel = function(modelName){
    this.isInitVar = false;
    if((typeof modelName !== 'undefined') && modelName){
        this.initVars(modelName);
    }
    return this;
};
DbModel.prototype.initVars = function(modelName){
    this.modelName      = modelName;
    this.redis          = redis;
    this.redisCachKey   = redisConfig.cachKey + this.modelName;
    this.liveTime       = redisConfig.liveTime;
    this.isInitVar      = true;
    return this;
};
DbModel.prototype.setLiveTime = function(liveTime){
    this.liveTime       = liveTime;
    return this;
};
DbModel.prototype.init = function(data){
    if(!this.isInitVar){
        console.error('Попытка проинициализировать методы BD без названия схемы (madelName)');
        return false;
    }
    this.model = mongoose.model(this.modelName);
    if((typeof data !== 'undefined') && data){
        this.inst = this.model(data)
    }
    return this;
};

DbModel.prototype.getById = function(id,done){
  var _this = this;
  this.init();
  this.model.findOne({_id:id},function(err,data){
      if(err){
          console.error('Not found by %s',id,err);
          return done(err);
      }
      if(!data){
          console.error('Empty data from %s',id,data);
          return done(false,data);
      }
      return done(null,data);
  });
  return this;
};

DbModel.prototype.selectData = function(where,fields,sort,offset,limit,done) {
    var _this = this;
    var redisKeyObj, redisKey;
    this.init();

    where   = where || {};
    fields  = fields || {};
    sort    = sort || {};
    offset  = offset || 0;
    limit   = typeof limit === 'undefined' ? false : limit;

    redisKeyObj = {
        where   : where,
        fields  : fields,
        sort    : sort,
        offset  : offset,
        limit   : limit
    };
    redisKey = JSON.stringify(redisKeyObj);

    // пытаемся получить данные из кеша
    this.redis.get(redisKey,function(err,data) {
        if(err || !data) {
            process.nextTick(directGetData());
            return;
        }
       return done(null,JSON.parse(data))
    });

    // видимо из кеша не получилось
    // пытаемся получить из mongodb
    function directGetData() {
       _this.model
           .find(where,fields)
           .sort(sort)
           .skip(offset)
           .limit(limit)
           .exec(function(err,rows) {
              if(err){
                  console.error('Не удалось получить данные из mongodb (%s)',_this.modelName,err);
                  return done(err);
              }
              if(!rows) {
                  return done(false,rows);
              }

              _this.redis.set(redisKey,JSON.stringify(rows),function(err){
                  if(err){
                      console.error('Не удалось сохранить в кеше найденные данные (%s - %s)',redisKey,JSON.stringify(rows));
                  } else {
                      _this.redis.expire(redisKey,_this.liveTime,function(err){
                          if(err){
                              console.error('Не удалось установить время жизни для %s',redisKey,err);
                          }
                          return;
                      });
                      return done(null,rows);
                  }
              });
           });
    } // directGetData

}; // selectData

module.exports = DbModel;
