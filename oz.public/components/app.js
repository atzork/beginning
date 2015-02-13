var oz = angular.module('oz', ['ngMessages','ui.router']);

/**
 * Routers
 */

oz.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',function($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',

      views: {
        '': {templateUrl: '/components/home/home.html'},
        'header': {templateUrl:'/components/shared/header/header.html'},
        'footer': {templateUrl: '/components/shared/footer/footer.html'}
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: '/components/about/about.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/api/login'
    })
    .state('create-password', {
      //url: '/create-password/:code',
      url: '/create-password/',
      templateUrl: '/api/create-password/54d490d0e237ecbaaf7f684a',
      controller: function($scope, $stateParams) {
        console.log($stateParams);
      }
    });

    $locationProvider.html5Mode(true);

    // url router provider
    $urlRouterProvider
      .when('','/index')
      .when('/home','/')
      .when('/create-password','/create-password')
      .otherwise('home')


}]);


/**
  * Directive-s
  */

// Validations
// -----------

// oz.compareTo
oz.directive('compareTo',function(){
  return {
    require: 'ngModel',
    scope: {
      otherModel: '=compareTo'
    },
    link: function(scope,elem,attrs,ngModel) {

      ngModel.$validators.compareTo = function(modelValue, viewValue) {
        var result = true;
        var value = modelValue || viewValue;
        var otherModelValue = scope.otherModel.$modelValue || scope.otherModel.$viewValue;
        result = value === otherModelValue;
        scope.otherModel.$setValidity('compareTo',result);
        return result;
      };

      scope.$watch("otherModel.$modelValue || otherModel.$viewValue",function() {
        ngModel.$validate();
      });

    } // link
  }
});

// Validations END
// ============


// templates
// ---------

// Footer block
oz.directive('footerBlock',function(){
  return {
    templateUrl: "/components/shared/footer/footer.html"
  }
});

// Header block
oz.directive('headerBlock',function(){
  return {
    templateUrl: "/components/shared/header/header.html"
  }
});

// templates END
// =============