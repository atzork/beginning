/**
 * Created by sergey on 2/26/15.
 */

var oz = oz || {};

oz.service('AuthInterceptor', ['$injector', function($injector) {
  var authStatus = [401, 403];
  var AuthInterceptor = {
    request: function(config) {
      var Auth = $injector.get('Auth');
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'JWT' + token;
      }

      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      return config;
    },

    response: function(response) {
      return response;
    },

    responseError: function(response) {
      if (authStatus.indexOf(response.status) !== -1) {
        console.log('Перехвачена неавторизированная попытка входа!!');
      }
      return response;
    }
  };
  return AuthInterceptor;
}]);

oz.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);