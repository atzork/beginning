var oz = angular.module('oz', ['ngMessages', 'ngResource', 'ui.router']);

oz.run(['$rootScope', 'userManager', function($rootScope, userManager) {
  $rootScope.$on('$stateChangeStart', function() {
    var userID = $rootScope.user ? $rootScope.user._id : null;
    $rootScope.pageClass = '';
    $rootScope.isNoHeader = false;

    userManager.getUser(userID, function(error, user) {
      if (error || !user) {
        $rootScope.redirect('/login');
      } else {
        $rootScope.user = user;
      }
    });
  });
}]);

oz.controller('mainController', [function () {
}]);

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
  var userManager = {
    _pool: {},
    _retrieveInstance: function(userId, userData) {
      var instance = this._pool[userId];
      if (instance) {
        instance.setData(userData);
      } else {
        instance = new User(userData);
        this._pool[userId] = instance;
      }
      return instance;
    }, //_retrieveInstance()
    _search: function(userId) {
      return this._pool[userId];
    },
    _load: function(userId, done) {
      console.log('GET USER');
      var self = this;
      var userIdParams = userId ? {id: userId} : null;
      return userProxy.get(userIdParams, function(resp) {
        if (resp.error || !resp.data) {
          console.error('Error get user');
        } else {
          self._retrieveInstance(resp.data._id, resp.data);
        }
        done(resp.error, resp.data, resp);
        return self;
      });
    }, // _load()
    _editPassword: function(userData, done) {
      var self = this;
      console.log('Создание пароля для ', userData._id);
      return userProxy.createPassword(null, userData, function(resp) {
        console.log('ответ сервера на изменение пароля', resp);
        done(resp.error);
        return self;
      });
    },

    // получение пользователя от сервака
    getUser: function(userId, done) {
      var user = this._search(userId);
      if (user) {
        done(null, user, null);
      } else {
        this._load(userId, done);
      }
      return this;
    },

    // редактирование пользователя
    setUser: function(userData, done) {
      var self = this;
      var user = this._search(userData._id);
      if (user) {
        user.setData(userData);
      } else {
        user = self._retrieveInstance(userData);
      }
      this._save(user, done);
      return this;
    },

    // создание пароля
    editPassword: function(userData, done) {
      var self = this;
      this._editPassword(userData, function(error) {
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
      .otherwise('/dashboard');
  }]);

/**
  * Directive-s
  */

// Validations
// -----------

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
// ============

// templates
// ---------

// templates END
// =============