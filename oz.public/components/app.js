var oz = angular.module('oz', ['ngMessages','ui.router']);

/**
 * Routers
 */

oz.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',function($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      views: {
        '': {templateUrl: '/components/dashboard/dashboard.html'},
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
      views: {
        '': {templateUrl: '/api/login'},
        'footer': {templateUrl: '/components/shared/footer/footer.html'}
      }
    })
    .state('create-password', {
      url: '/create-password/:code',
      views: {
        '' : {
          //54d490d0e237ecbaaf7f684a
          templateUrl: function(params){
            return '/api/create-password/' + params.code;
          }
        },
        'header': {templateUrl:'/components/shared/header/header.html'},
        'footer': {templateUrl: '/components/shared/footer/footer.html'}
      }
    });

    $locationProvider.html5Mode(true);

    // url router provider
    $urlRouterProvider
      //.when('/dashboard','/')
      .otherwise('dashboard');
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