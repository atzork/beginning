/**
 * Created by sergey on 2/9/15.
 * Create Password Controllers
 */

// oz.CreatePasswordController
oz.controller('CreatePasswordController',['$scope','$http',function($scope,$http){
  $scope.authPending = false;
  $scope.createPasswordAction = function createPasswordAction(formData,validity) {
    if(validity){
      console.log(formData);

      $scope.authPending = true;
      $http.post('/api/create-password',formData)
        .success(function() {
          $scope.authPending = false;
          console.log('Success create password');
        })
        .error(function(answ,status) {
          $scope.authPending = false;
          console.error('Error create password');
          if(!answ) {
            return false;
          }

          if(answ.typeError){
            switch (parseInt(answ.typeError,10)) {
              case 1:
                $scope.authForm.password.$setValue('emailNotFound',true);
                break;
              case 22:
                $scope.authForm.password.$setValue('passwordFormat',true);
                break;
            }
          } else {
            //$scope.authForm.$setPristine(true);
          }

          //console.log($scope.authForm.password);

        });
      return false;
    } // form validity?
  }; // authAction

}]); // CreatePasswordController,,,
