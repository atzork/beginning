module.exports.commonModel = function commonModel(app) {
  var config = app.get('config');
  var mongoose = app.get('mongoose');
  var redis = app.get('redis');
//var _ = require('lodash');

  var redisConfig = config.get('db:redis');

  var DbModel;
  DbModel = function (modelName, schema) {
    this.isInitVar = false;
    if ((typeof modelName !== 'undefined') && modelName) {
      this.initVars(modelName, schema);
    }
    //return this;
  };
  DbModel.prototype.initVars = function (modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;
    this.redis = redis;
    this.redisCacheKey = redisConfig.cacheKey + this.modelName;
    this.liveTime = redisConfig.liveTime;
    this.isInitVar = true;
    return this;
  };
  DbModel.prototype.setLiveTime = function (liveTime) {
    this.liveTime = liveTime;
    return this;
  };
  DbModel.prototype.init = function (data) {
    if (!this.isInitVar) {
      console.error('Попытка проинициализировать методы BD без названия схемы (madelName)');
      return false;
    }
    this.model = mongoose.model(this.modelName, this.schema);
    if ((typeof data !== 'undefined') && data) {
      this.inst = this.model(data);
    }
    return this;
  };

  DbModel.prototype.getById = function (id, done) {
    this.init();
    this.model.findById(id, function (err, data) {
      if (err) {
        console.error('Not found by %s', id, err);
        return done(err);
      }
      if (!data) {
        console.error('Empty data from %s', id, data);
        return done(false, data);
      }
      return done(null, data);
    });
    return this;
  };

  DbModel.prototype.selectData = function (done, where, fields, sort, offset, limit) {
    var self = this;
    var redisKeyObj, redisKey;
    this.init();

    where = where || {};
    fields = fields || {};
    sort = sort || {};
    offset = offset || 0;
    limit = typeof limit === 'undefined' ? false : limit;

    redisKeyObj = {
      where: where,
      fields: fields,
      sort: sort,
      offset: offset,
      limit: limit
    };
    redisKey = JSON.stringify(redisKeyObj);

    // пытаемся получить данные из кеша
    this.redis.hget(self.redisCacheKey, redisKey, function (err, row) {
      if (err || !row) {
        process.nextTick(directGetData());
        return;
      }
      done(null, JSON.parse(row));
    });

    // видимо из кеша не получилось
    // пытаемся получить из mongodb
    function directGetData() {
      self.model
        .find(where, fields)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .exec(function (err, rows) {
          if (err) {
            console.error('Не удалось получить данные из mongodb (%s)', self.modelName, err);
            return done(err);
          }
          if (!rows) {
            return done(false, rows);
          }

          process.nextTick(function () {
            // сохраняем в REDIS-кеше полученные из mongodb данные
            self.redis.hset(self.redisCacheKey, redisKey, JSON.stringify(rows), function (err) {
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

  DbModel.prototype.insertData = function (data, done) {
    var self = this;
    this.init(data);

    this.inst.save(function (err, row, affected) {
      if (err) {
        console.error('Ошибка добавления данных в mongodb ', data, err);
        return done(err);
      }
      if (!affected) {
        return done(false, affected);
      }
      self.redisRemoveData(self.redisCacheKey, function (err) {
        if (err) {
          console.error(err);
        }
        return done(null, affected);
      });
      return this;
    });
    return this;
  }; // insertData

  DbModel.prototype.updateData = function (done, where, set, upsert, multiple) {
    var self = this;
    var method, updateOptions;

    this.init();

    if (typeof upsert !== 'boolean') {
      upsert = false;
    }
    if (typeof multiple !== 'boolean') {
      multiple = false;
    }

    updateOptions = {
      multi: multiple,
      upsert: upsert
    };

    if (multiple === false) {
      method = 'findOneAndUpdate';
      updateOptions = {};
    } else {
      method = 'update';
    }

    this.model[method](where, set, updateOptions, function (err, affected) {
      if (err) {
        console.error('Не удалось обновить данные (%s)', self.modelName);
        return done(err);
      }

      console.log(set);
      //console.log('update: %s',method, arguments);

      if (!arguments[1] || (arguments[1] === null)) {
        affected = 0;
      }
      //else if (!_.isNumber(arguments[1]) || (typeof arguments[1] === 'object')) {
      //  affected = 1;
      //}

      if (!affected) {
        return done(false, affected);
      }

      process.nextTick(function () {
        self.redisRemoveData(self.redisCacheKey, function () {
          return done(null, affected);
        });
      });
    });  // update-method
    return this;
  }; // updateData

  DbModel.prototype.deleteData = function (where, done) {
    var self = this;
    this.init();
    this.model.remove(where, function (err, affected) {
      if (err) {
        console.error('Не удалось удалить данные (%s)', self.modelName, err);
        return done(err);
      }
      if (!affected) {
        console.log('Не было удалено ни одной строки из mongodb.%s ', self.modelName);
        return done(false, affected);
      }
      process.nextTick(function () {
        self.redisRemoveData(self.redisCacheKey, function () {
          return done(null, affected);
        });
      });
    });
    return this;
  }; // deleteData

  DbModel.prototype.redisRemoveData = function (redisCacheKey, done) {
    this.redis.del(redisCacheKey, function (err, affected) {
      if (err) {
        console.error('Не удалось удалить запись из кеша REDIS!! (%s)', redisCacheKey, err);
        return done(err);
      }
      if (!affected) {
        console.log('Записи не были удалены (%s)', redisCacheKey);
        return done(false, affected);
      }
      return done(null, affected);
    });

    return this;
  }; // redisRemoveData

  return DbModel;
};
