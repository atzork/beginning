/**
 * Created by Zork on 08.02.2015.
 */

var mongoose= require('../lib/mongoose');
var config  = require('../config');
var _f      = require('../lib/_f');
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
    this.redisCacheKey  = redisConfig.cacheKey + this.modelName;
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

DbModel.prototype.selectData = function(done,where,fields,sort,offset,limit) {
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
    this.redis.hget(_this.redisCacheKey,redisKey,function(err,row) {
        if(err || !row) {
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

              process.nextTick(function() {
                  // сохраняем в REDIS-кеше полученные из mongodb данные
                  _this.redis.hset(_this.redisCacheKey, redisKey, JSON.stringify(rows), function (err) {
                      if (err) {
                          console.error('Не удалось сохранить в кеше найденные данные (%s - %s)', redisKey, JSON.stringify(rows));
                      }
                      return done(null, rows);
                  });
              });

              return rows;
           });
    } // directGetData
    return this;
}; // selectData

DbModel.prototype.insertData = function(data,done) {
    var _this = this;
    this.init(data);

    this.inst.save(function(err,row,affected){
        if(err) {
            console.error('Ошибка добавления данных в mongodb ',data,err);
            return done(err);
        }
        if(!affected){
            return done(false,affected);
        }
        _this.redisRemoveData(_this.redisCacheKey,function(err){
            if(err){}
            return done(null,affected);
        });
        return this;
    });
    return this;
}; // insertData

DbModel.prototype.updateData = function(done,where,set,upsert,multiple){
    var _this = this;
    var method, updateOptions;

    this.init();

    if(typeof upsert !== 'boolean') {
        upsert   = false;
    }
    if(typeof multiple !== 'boolean'){
        multiple = false;
    }

    updateOptions = {
        multi   : multiple,
        upsert  : upsert
    };

    if(multiple === false){
        method          = 'findOneAndUpdate';
        updateOptions   = {};
    } else {
        method = 'update';
    }

    this.model[method](where,set,updateOptions,function(err,affected,row){
        if(err){
            console.error('Не удалось обновить данные (%s)', _this.modelName);
            return done(err);
        }

        if(!arguments[1] || (arguments[1] === null)){
            affected = 0;
        } else if(!_f.isNumber(arguments[1]) || (typeof arguments[1] === 'object')){
            affected = 1;
        }

        if(!affected){
            return done(false,affected);
        }

        process.nextTick(function() {
            _this.redisRemoveData(_this.redisCacheKey, function() {
                return done(null, affected);
            });
        });
    });  // update-method
    return this;
}; // updateData

DbModel.prototype.deleteData = function(where, done) {
    var _this = this;
    this.init();
    this.model.remove(where,function(err,affected){
       if(err) {
           console.error('Не удалось удалить данные (%s)',_this.modelName,err);
           return done(err);
       }
       if(!affected) {
           console.log('Не было удалено ни одной строки из mongodb.%s ',_this.modelName);
           return done(false,affected);
       }
       process.nextTick(function(){
          _this.redisRemoveData(_this.redisCacheKey,function(){
              return done(null,affected);
          });
       });
    });
    return this;
}; // deleteData

DbModel.prototype.redisRemoveData = function(redisCacheKey,done){
  this.redis.del(redisCacheKey,function(err,affected){
      if(err){
          console.error("Не удалось удалить запись из кеша REDIS!! (%s)",redisCacheKey,err);
          return done(err);
      }
      if(!affected){
          console.log('Записи не были удалены (%s)',redisCacheKey);
          return done(false,affected);
      }
      return done(null,affected);
  });

  return this;
}; // redisRemoveData

module.exports = DbModel;
