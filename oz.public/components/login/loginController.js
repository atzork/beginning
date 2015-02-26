/**
 * Created by sergey on 2/11/15.
 * Login controllers
 */

var oz = oz || {};
console.log('loginController:: ', oz);

// oz.authenticateCtrl
oz.controller('AuthenticateCtrl', ['$rootScope', '$scope', '$state', '$injector', 'Auth',
  function($rootScope, $scope, $state, $injector, Auth) {
    console.log('AuthenticateCtrl');
    $rootScope.pageClass = 'login-box';
    $rootScope.isNoHeader = true;

    $scope.authAction = function authAction(formData, validity) {
      if (validity) {
        $scope.authPending = true;
        Auth.logIn(formData, function(error) {
          $scope.authPending = false;
          if (error) {
            for (var att in $scope.authForm.$error) {
              if ($scope.authForm.$error.hasOwnProperty(att)) {
                $scope.authForm.email.$setValidity(att, true);
                $scope.authForm.password.$setValidity(att, true);
              }
            }

            $scope.allowSubmit = false;
            if (error.typeError) {
              switch (parseInt(error.typeError, 10)) {
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
            }
          } else {
            $state.go('app.dashboard');
          }
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
