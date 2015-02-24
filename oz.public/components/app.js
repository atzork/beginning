var oz = angular.module('oz', ['ngMessages', 'ngResource', 'ui.router']);

oz.run([
  '$rootScope', '$injector', 'userManager',
  function($rootScope, $injector, userManager) {
    $rootScope.$on('$stateChangeStart', function() {
      var userID = $rootScope.user ? $rootScope.user._id : null;
      var state;
      $rootScope.pageClass = '';
      $rootScope.isNoHeader = false;

      if (!userID) {
        state = $injector.get('$state');
        userManager.getUser(null, function (error, user) {
          if (error || !user) {
            state.go('app.login');
          } else {
            $rootScope.user = user;
          }
        });
      }
    });
  }
]);

oz.controller('mainController', [function () {
}]);

/**
 * Interceptors
 */

oz.service('AuthInterceptor', ['$injector', function($injector) {
  var authStatus = [401, 403];
  var AuthInterceptor = {
    request: function(config) {
      var Auth = $injector.get('Auth');
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'JWT' + token;
      }
      return config;
    },

    responseError: function(response) {
      var $state = $injector.get('$state');
      if (authStatus.indexOf(response.status) !== -1) {
        $state.go('app.login');
      }
      return response;
    }
  };
  return AuthInterceptor;
}]);

/**
 * Services
 */

oz.service('Auth', ['$resource', '$state', '$window', 'userManager', function($resource, $state, $window, userManager) {
  var authProxy = $resource('/api/user', null, {
    logIn: {method: 'POST', url: '/api/user/login'},
    logOut: {method: 'POST', url: '/api/user/logout'}
  });
  var Auth = {
    // Token
    getToken: function() {
      return $window.localStorage.gatItem('token');
    },
    setToken: function(token) {
      $window.localStorage.setItem('token', token);
      return this;
    },
    deleteToken: function() {
      $window.localStorage.removeItem('token');
      return this;
    },

    logIn: function(userData, done) {
      var self = this;
      return authProxy.logIn(function(resp) {
        if (resp.error || !resp.data || !resp.data.user) {
          console.error('User Login Error!!');
          done(resp.error);
        } else {
          if (resp.data.token) {
            Auth.setToken(resp.data.token);
          }
          userManager.setUserLocal(resp.data.user);
          done(resp.error, resp.data, resp);
        }
        return self;
      });
    },

    logOut: function(done) {
      var self = this;
      return authProxy.logOut(function(resp) {
        if (resp.error || !resp.data || !resp.data.user) {
          console.error('LogOut Error!!');
          done(resp.error);
        } else {
          Auth.deleteToken();
          $state.go('app.login');
          userManager.deleteUserLocal(resp.data.user);
          done(resp.error, resp.data, resp);
        }
        return self;
      });
    }

  };

  return Auth;
}]);

/**
 * Factory
 */

oz.factory('User', [function() {
  function User(userData) {
    if (userData) {
      this.setData(userData);
    }
  }
  User.prototype = {
    setData: function(userData, done) {
      done = done || angular.noop;
      angular.extend(this, userData);
      done();
      return this;
    }
  };
  return User;
}]);

oz.factory('userManager', ['$resource', 'User', function($resource, User) {
  var userProxy = $resource('/api/user/', null, {
    get: {method: 'GET', url: '/api/user/get/:id'},
    createPassword: {method: 'POST', url: '/api/user/edit-password'}
  });
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
    console.log('GET USER');
    var userIdParams = userId ? {id: userId} : null;
    return userProxy.get(userIdParams, function(resp) {
      if (resp.error || !resp.data) {
        console.error('Error get user');
      } else {
        retrieveInstance(resp.data);
      }
      done(resp.error, resp.data, resp);
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

  // main method
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
    deleteUserLocal: function(userData, userId) {
      userId = userData._id ? userData._id : (userId || null);
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

/**
 * Routers
 */

oz.config([
  '$stateProvider', '$locationProvider', '$urlRouterProvider',
  function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        url: '',
        views: {
          '@': {
            template: '<ui-view />'
          },
          header: {
            templateUrl: '/components/shared/header/header.html'
          },
          footer: {
            templateUrl: '/components/shared/footer/footer.html'
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: '/components/dashboard/dashboard.html'
      })
      .state('app.about', {
        url: '/about',
        templateUrl: '/components/about/about.html',
        controller: ['$rootScope', function($rootScope) {
          console.log('ABOUT USER:: ', $rootScope.user);
        }]
      })
      .state('app.login', {
        url: '/login',
        templateUrl: '/api/login',
        controller: 'AuthenticateCtrl'
      })
      .state('app.create-password', {
        url: '/create-password/:code',
        templateUrl: function(params) {
          return '/api/create-password/' + params.code;
        },
        controller: 'CreatePasswordController'
      });

    $locationProvider.html5Mode(true);

    // url router provider
    $urlRouterProvider
      //.when('/', '/dashboard')
      //.otherwise('/dashboard');
      .otherwise(function($injector) {
        var rootScope = $injector.get('$rootScope');
        var userManager = $injector.get('userManager');
        var userID = rootScope.user ? rootScope.user._id : null;
        var state;
        if (!userID) {
          state = $injector.get('$state');
          userManager.getUser(null, function (error, user) {
            if (error || !user) {
              state.go('app.login');
            } else {
              rootScope.user = user;
              state.go('app.dashboard');
            }
          });
        } else {
          state.go('app.dashboard');
        }
      });
  }]);

/**
  * Directive-s
  */

// Validations

// oz.compareTo
oz.directive('compareTo', function() {
  return {
    require: 'ngModel',
    scope: {
      otherModel: '=compareTo'
    },
    link: function(scope, elem, attrs, ngModel) {
      ngModel.$validators.compareTo = function(modelValue, viewValue) {
        var result;
        var value = modelValue || viewValue;
        var otherModelValue = scope.otherModel.$modelValue || scope.otherModel.$viewValue;
        result = value === otherModelValue;
        scope.otherModel.$setValidity('compareTo', result);
        return result;
      };

      scope.$watch('otherModel.$modelValue || otherModel.$viewValue', function() {
        ngModel.$validate();
      });
    } // link
  };
});

// Validations END

// templates
// templates END