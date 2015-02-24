/**
 * Created by sergey on 2/11/15.
 * Login controllers
 */

var oz = oz || {};

// oz.authenticateCtrl
oz.controller('AuthenticateCtrl', ['$rootScope', '$scope', '$http', '$location',
  function($rootScope, $scope, $http, $location) {
    $rootScope.pageClass = 'login-box';
    $rootScope.isNoHeader = true;
    $scope.authPending = false;
    $scope.authAction = function authAction(formData, validity) {
      if (validity) {
        $scope.authPending = true;
        $http.post('/api/login', formData)
          .success(function() {
            $scope.authPending = false;
            $location.path('/dashboard');
          })
          .error(function(answ) {
            $scope.authPending = false;
            if (!answ) {
              return false;
            }
            for (var att in $scope.authForm.$error) {
              if ($scope.authForm.$error.hasOwnProperty(att)) {
                $scope.authForm.email.$setValidity(att, true);
              }
            }
            $scope.authForm.$setPristine(true);
            //$scope.authForm.email.$setValidity('emailNotFound', true);
            //alert();
            $scope.allowSubmit = false;
            if (answ.typeError) {
              switch (parseInt(answ.typeError, 10)) {
                case 1:
                  $scope.authForm.email.$setValidity('emailNotFound', false);
                  $scope.allowSubmit = true;
                  break;
                case 2:
                  $scope.authForm.password.$setValidity('wrongPassword', false);
                  $scope.allowSubmit = true;
                  break;
                default:
                  break;
              }
            } // if error from server

            console.log('error:: ', arguments);
          });
      }
      return false;
    };

    $scope.forgotPassword = function forgotPassword(email) {
      $scope.forgotPasswordProcess = false;
      console.log(email);
      //$http.post('/forgot-password',{email:email})
      //  .success()
      //  .error();
      console.log('forgotPasswordProcess');
      return false;
    };
  }
]);
