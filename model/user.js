/**
 * Created by sergey on 2/3/15.
 */
var crypto = require('crypto');
var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schemaUser = new Schema({
  'email': {
    type    : String,
    required: true,
    index   : {unique: true},
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

  // role information ----

  'role': {
    // owner, staff, customer
    type    : String,
    required: true
  },
  'invitationKey': {
    type  : String,
    trim  : true,
    index : {
      unique: true,
      spare : true
    }
  },
  'userIdOuter': {
    type  : Schema.Types.ObjectId,
    index : {spare: true}
  },

  // personal information ----

  'firstName': {
    type  : String,
    trim  : true,
    index : true
  },
  'lastName': {
    type  : String,
    trim  : true,
    index : true
  },
  'emails': { type: [String] },
  'phones': { type: [String] },
  'address': {
    type: String,
    trim: true
  },
  'birth': { type: Date },

  // busines info -------
  'paymentMethod': [{
    system: {
      type    : String,
      required: true,
      trim    : true
    },
    'cardNumber': {
      type    : String,
      required: true,
      trim    : true
    },
    'cvv'       : { type: Number },
    'billingZip': { type: Number }
  }],
  'membership': [{
    'kind'  : { type: String },
    'start' : { type: Date },
    'end'   : { type: Date }
  }],

  // customer info -----
  'classPack': [{
    kind: {
      type: String,
      trim: true
    },
    remaning: { type: Number },
    nameActivity: {
      type: String,
      trim: true
    },
    staffId:{ type: Schema.Types.ObjectId },
    staffName: {
      type: String,
      trim: true
    }
  }]
});

schemaUser.virtual('nameFull')
  .get(function(){
    return this.firstName + this.lastName;
  });

schemaUser.virtual('password')
  .set(function(password){
    this._plainPassword = password;
    this.salt           = '' + Math.random();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function(){
    return this._plainPassword;
  });

schemaUser.methods.encryptPassword = function(password){
  if(!this.salt){this.salt=''} // @todo убрать когда сделаю нормальный функционал!!!
  return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
};

schemaUser.methods.checkPassword = function(password){
  return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User',schemaUser);