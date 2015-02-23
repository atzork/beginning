var oz = angular.module('oz', ['ngMessages', 'ngResource', 'ui.router']);

oz.run(['$rootScope', 'User', function($rootScope, User) {
  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.pageClass = '';
    $rootScope.isNoHeader = false;
    $rootScope.user = new User();
    $rootScope.user.get(function() {
      console.log('Получили ответ на запрос:: ', arguments);
      //console.log('итого USER:: ', console.log($rootScope.user));
    });
  });
}]);

oz.controller('mainController', [function () {
}]);

oz.factory('User', ['$resource', function($resource) {
  var userProxy = $resource('/api/user/', null, {
    get: {method: 'GET', url: '/api/user/get/:id'}
  });
  console.log(this);
  function User(userData) {
    if (userData) {
      this.setData(userData);
    }
  }
  User.prototype = {
    setData: function(userData, done) {
      done = done || angular.noop;
      console.log('Установка пользователя:: ', userData);
      angular.extend(this, userData);
      console.log('После обновления:: ', this);
      return done ? done() : this;
    },

    get: function(done) {
      console.log('GET USER');
      var self = this;
      var userIdParams = this._id ? {id: this._id} : null;
      return userProxy.get(userIdParams, function(resp) {
        console.log('получили ответ с пользователем');
        if (resp.error) {
          console.error('Error get user');
        } else {
          self.setData(resp.data);
        }
        console.log('отдаем пользователя');
        return done(resp.error, resp.data, resp);
      });
    },

    load: function(done) {
      return $resource.get('/api/get-user' + this.id, function(resp) {
        return done(resp.error, resp.data, resp);
      }, function(resp) {
        return done(resp.error, resp.data, resp);
      });
    },

    edit: function(done) {
      return $resource.put('/api/edit-user/ + this.id', function(resp) {
        return done(resp.error, resp.data, resp);
      });
    },

    createPassword: function(formData, done) {
      return $resource.post('/api/create-password', formData, function(resp) {
        return done(resp.error, resp.data, resp);
      });
    }
  };
  return User;
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