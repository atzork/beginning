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
};
DbModel.prototype.initVars = function(modelName){
    this.modelName      = modelName;
    this.redis          = redis;
    this.redisCachKey   = redisConfig.cachKey + this.modelName;
    this.isInitVar      = true;
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
};

module.exports = DbModel;
