/**
 * Created by sergey on 2/26/15.
 */

var oz = oz || {};

oz.config([
  '$locationProvider', '$stateProvider', '$urlRouterProvider',
  function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

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
        controller: ['Session', 'userManager', function(Session, userManager) {
          var currUser = null;
          userManager.getUser(Session.userID, function(error, user) {
            if (!error && user) {
              currUser = user;
            }
          });
          console.log('ABOUT USER:: ', currUser);
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

    $urlRouterProvider
      .otherwise(function($injector) {
        var userManager = $injector.get('userManager');
        var Session = $injector.get('Session');
        var state = $injector.get('$state');
        if (!Session.userID) {
          userManager.getUser(null, function (error, user) {
            if (error || !user) {
              state.go('app.login');
            } else {
              Session.create(user._id, user.role);
              state.go('app.dashboard');
            }
          });
        } else {
          state.go('app.dashboard');
        }
      });
  }
]);
