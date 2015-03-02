/**
 * Created by sergey on 2/26/15.
 */

var oz = oz || {};

oz
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])

  .config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {
    $stateProvider
      .state('app', {
        abstract: true,
        url: '',
        data: {
          authRoles: [USER_ROLES.admin, USER_ROLES.staff]
        },
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
        templateUrl: '/components/dashboard/dashboard.html',
        data: {
          accessAllow: true
        }
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
        controller: 'AuthenticateCtrl',
        data: {
          accessAllow: true
        }
      })
      .state('app.create-password', {
        url: '/create-password/:code',
        templateUrl: function(params) {
          return '/api/create-password/' + params.code;
        },
        controller: 'CreatePasswordController'
      });
  }])

  .config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider
      .when('/', '/dashboard')
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
  }]);
