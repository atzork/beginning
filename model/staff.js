/**
 * Created by sergey on 2/3/15.
 */
var crypto = require('crypto');
var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schemaUser = new Schema({
  'email': {
    type    : String,
    unique  : true,
    required: true,
    index   : {unique:true},
    trim    : true
  },
  'hashedPassword': {
    type    : String,
    required: true,
    trim    : true
  },
  'salt': {
    type    : String,
    required: true,
    trim    : true
  },
  // owner, staff, customer
  'role': {
    type: String,
    required: true
  }
  'staffId': {
    type: ObjecdId
    index: {spare: true}
  }

});

schemaUser.virtual('pas')
  .set(function(password){
    this._plainPassword = password;
    this.salt           = '' + Math.random();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function(){
    return this._plainPassword;
  });

schemaUser.methods.encryptPassword = function(password){
  return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
};

schemaUser.methods.checkPassword = function(password){
  return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User',schemaUser);