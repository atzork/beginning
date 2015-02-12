var oz = angular.module('oz', ['ngMessages','ui.router']);

/**
 * Routers
 */

oz.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',function($stateProvider, $locationProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/components/home/home.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: '/components/about/about.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/components/login/login.html'
    })
    //.state('create-password', {
    //  url: '/create-password/54d490d0e237ecbaaf7f684a',
    //  templateUrl: '/create-password/54d490d0e237ecbaaf7f684a'
    //
    //})
    .state('create-password', {
      url: '/create-password/:code',
      templateUrl: '/create-password/54d490d0e237ecbaaf7f684a',
      controller: function($scope, $stateParams) {
        console.log($stateParams);
        //alert($stateParams.code);
      }
    });
    $locationProvider.html5Mode(true);
}]);


/**
  * Directive-s
  */

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