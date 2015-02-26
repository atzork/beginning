/**
 * Created by sergey on 2/26/15.
 */

var oz = oz || {};

oz
  .factory('User', [function() {
    function User(userData) {
      if (userData) {
        this.setData(userData);
      }
    }
    User.prototype.setData = function(userData, done) {
      done = done || angular.noop;
      angular.extend(this, userData);
      done();
      return this;
    };

    return User;
  }])

  .factory('userManager', ['$resource', 'User', function($resource, User) {
  var userProxy = $resource('/api/user/', null, {
    get: {method: 'GET', url: '/api/user/get/:id'},
    createPassword: {method: 'POST', url: '/api/user/edit-password'}
  });

  // для хранения массива пользователей (контакты в чате, например)
  var pool = {};

  function search(userId) {
    if (!userId) {
      console.error('User ID is not defined!! - User not resolved');
      return false;
    }
    return pool[userId];
  }

  function retrieveInstance(userData, userId) {
    userId = userData._id ? userData._id : (userId || null);
    if (!userId) {
      console.error('User ID is not defined!! - User not resolved');
      return false;
    }
    var instance = pool[userId];
    if (instance) {
      instance.setData(userData);
    } else {
      instance = new User(userData);
      pool[userId] = instance;
    }
    return instance;
  }

  function load(userId, done) {
    console.log('GET USER:: ', userId);
    var userIdParams = userId ? {id: userId} : null;
    console.log('подгружаем используя:: ', userIdParams);
    return userProxy.get(userIdParams, function(resp) {
      console.log('подгрузили пользователя:: ', resp);
      if (resp.error || !resp.data || !resp.data.user) {
        console.error('Error get user');
        done(resp.error);
      } else {
        retrieveInstance(resp.data.user);
        done(resp.error, resp.data.user, resp);
      }
      return;
    });
  }

  function editPassword(userData, done) {
    console.log('Создание пароля для ', userData._id);
    return userProxy.createPassword(null, userData, function(resp) {
      console.log('ответ сервера на изменение пароля', resp);
      done(resp.error);
      return;
    });
  }

  var userManager = {
    // получение пользователя от сервака
    getUser: function(userId, done) {
      var user = search(userId);
      if (user) {
        done(null, user, null);
      } else {
        load(userId, done);
      }
      return this;
    },

    // set local userData (logIn)
    setUserLocal: function(userData, userId) {
      retrieveInstance(userData, userId);
      return this;
    },

    // delete local userData (logOut)
    deleteUserLocal: function(userId) {
      var user = search(userId);
      if (user) {
        delete pool[userId];
        return true;
      }
      console.log('User data is not found!!');
      return false;
    },

    // редактирование пользователя
    setUser: function(userData, done) {
      var user = search(userData._id);
      if (user) {
        user.setData(userData);
      } else {
        user = retrieveInstance(userData);
      }
      this._save(user, done);
      return this;
    },

    // создание пароля
    editPassword: function(userData, done) {
      var self = this;
      editPassword(userData, function(error) {
        if (error) {
          done(error);
        } else {
          done(null);
        }
        return self;
      });
    }
  };

  return userManager;
}]);
