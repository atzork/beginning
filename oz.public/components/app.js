var oz = angular.module('oz', ['ngMessages','ui.router']);

/**
 * Routers
 */

oz.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwize('/home');
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
    .state('create-password', {
      url: '/create-password',
      templateUrl: '/components/createPassword/createPassword.html'
    })
});


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