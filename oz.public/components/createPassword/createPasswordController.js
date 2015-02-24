/**
 * Created by sergey on 2/9/15.
 * Create Password Controllers
 */

var oz = oz || {};

// oz.CreatePasswordController
oz.controller('CreatePasswordController', ['$scope', 'userManager', function($scope, userManager) {
  $scope.authPending = false;
  $scope.createPasswordAction = function createPasswordAction(formData, validity) {
    if (validity) {
      console.log(formData);

      $scope.authPending = true;
      userManager.editPassword(formData, function(error) {
        $scope.authPending = false;
        if (error) {
          console.error(error);
          if (error.typeError) {
            switch (parseInt(error.typeError, 10)) {
              case 11:
                $scope.authForm.password.$setValue('userNotFound', true);
                break;
              case 21:
                $scope.authForm.password.$setValue('passwordFormat', true);
                break;
              default:
                break;
            }
          }
        } else {
          console.log('Success create password');
        }
      });
      return false;
    } // form validity?
  }; // authAction
}]); // CreatePasswordController,,,
