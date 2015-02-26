var oz = angular.module('oz', ['ngMessages', 'ngResource', 'ui.router']);

oz.run([
  '$rootScope', '$injector', 'userManager', 'Session',
  function($rootScope, $injector, userManager, Session) {
    $rootScope.$on('$stateChangeStart', function() {
      $rootScope.pageClass = '';
      $rootScope.isNoHeader = false;

      if (!Session.userID) {
        userManager.getUser(null, function (error, user) {
          if (error || !user) {
            $injector.get('$state').go('app.login');
          } else {
            Session.create(user._id, user.role);
          }
        });
      }
      return false;
    });
  }
]);
