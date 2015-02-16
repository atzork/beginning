/**
 * Created by sergey on 2/11/15.
 * Login controllers
 */

// oz.authenticateCtrl
oz.controller('authenticateCtrl',['$scope','$http','$location',function($scope,$http,$location){

  $scope.authPending = false;
  $scope.authAction = function authAction(formData, validity){
    if(validity){
      $scope.authPending = true;
      $http.post('/api/login',formData)
        .success(function(){
          $scope.authPending = false;
          $location.path('/dashboard');
        })
        .error(function(answ,status){
          $scope.authPending = false;
          console.log($scope.authPending);
          if(!answ){
            return false;
          }

          $scope.allowSubmit = false;
          if(answ.typeError){

            if(answ.typeError == 1) {
              $scope.authForm.email.$setValidity('emailNotFound',false);
              $scope.allowSubmit = true;
            } else {
              $scope.authForm.email.$setValidity('emailNotFound',true);
            }

            if(answ.typeError == 2) {
              $scope.authForm.password.$setValidity('wrongPassword',false);
              $scope.allowSubmit = true;
            } else {
              $scope.authForm.password.$setValidity('wrongPassword',true);
            }

          } // if error from server

          console.log('error:: ',arguments);
        });
    }
    return false;
  };

  $scope.forgotPassword = function forgotPassword(email){
    $scope.forgotPasswordProcess = false;
    //$http.post('/forgot-password',{email:email})
    //  .success()
    //  .error();
    console.log('forgotPasswordProcess');
    return false;
  }
}]);
