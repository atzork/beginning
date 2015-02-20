/**
 * Created by sergey on 2/9/15.
 * Create Password Controllers
 */

var oz = oz || {};

// oz.CreatePasswordController
oz.controller('CreatePasswordController', ['$scope', '$http', function($scope, $http) {
  $scope.authPending = false;
  $scope.createPasswordAction = function createPasswordAction(formData, validity) {
    if (validity) {
      console.log(formData);

      $scope.authPending = true;
      $http.post('/api/create-password', formData)
        .success(function() {
          $scope.authPending = false;
          console.log('Success create password');
        })
        .error(function(answ) {
          $scope.authPending = false;
          console.error('Error create password');
          if (!answ) {
            return false;
          }

          if (answ.typeError) {
            switch (parseInt(answ.typeError, 10)) {
              case 1:
                $scope.authForm.password.$setValue('emailNotFound', true);
                break;
              case 22:
                $scope.authForm.password.$setValue('passwordFormat', true);
                break;
              default:
                break;
            }
          }
        });
      return false;
    } // form validity?
  }; // authAction
}]); // CreatePasswordController,,,
