var oz = angular.module('oz', ['ngMessages', 'ngResource', 'ui.router']);

oz.run(['$rootScope', '$injector', 'AUTH_EVENTS', 'Auth', function($rootScope, $injector, AUTH_EVENTS, Auth) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    $rootScope.pageClass = '';
    $rootScope.isNoHeader = false;

    var authRoles = next.data.authRoles;
    var authStatus = true;
    console.log('next:: ', next);
    if (!next.data.accessAllow) {
      Auth.isAuthenticated(function (error, sessionData) {
        if (error || !sessionData) {
          console.error('Не аутентифицированный пользователь!!');
          authStatus = false;
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        } else {
          if (!Auth.isAuthorized(authRoles)) {
            console.log('Доступ к данному контенту с правами ' + authRoles + ' запрещен!!');
            authStatus = false;
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          }
        }
        if (!authStatus) {
          $injector.get('$state').go('app.login');
        }
        return;
      });
    }
    return true;
  });
}
]);
