var oz = angular.module('oz', ['ngMessages', 'ui.router']);

oz.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.pageClass = '';
    $rootScope.isNoHeader = false;
  });
}]);

oz.controller('mainController', [function () {
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
        templateUrl: '/components/about/about.html'
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