/**
 * Created by sergey on 2/2/15.
 */
var outinzadminApp = angular.module("outinzadminApp",['ngMessages']);

//outinzadminApp.directive('recordAvailabilityValidator',['$http',function($http) {
//  return {
//    require: 'ngModel',
//    link: function(scope,element,attrs,ngModel) {
//      var apiUrl = attrs.recordAvailabilityValidator;
//      console.log(arguments);
//      function setAsLoading(bool){
//        ngModel.$setValidity('recordLoading',!bool);
//      }
//      function setAsAvailable(bool) {
//        ngModel.$setValidity('recordAvailable',bool);
//      }
//      ngModel.$parsers.push(function(value) {
//        if(!value || !value.length){
//          return;
//        }
//        setAsLoading(true);
//        setAsAvailable(false);
//        $http.get(apiUrl,{v:value})
//          .success(function() {
//            console.log({v:value});
//            setAsLoading(false);
//            setAsAvailable(true);
//          })
//          .error(function(){
//            setAsLoading(false);
//            setAsAvailable(false);
//          });
//        return value;
//      })
//    }
//  }
//}]);

//outinzadminApp.directive('loginValidator',function() {
//  return {
//    restrict: 'AE',
//    require : 'ngModel',
//    link    : function($scope,elem,attrs,ngModel) {
//      ngModel.$validators.login = function(modelValue,viewValue) {
//        var value = modelValue || viewValue;
//        var result;
//        if(!value){
//          return;
//        }
//        result = /^[a-zA-Z0-9]+$/.test(value);
//        if(result){
//          $scope.validationError = false;
//        } else {
//          $scope.validationError = true;
//        }
//        return result;
//      }
//    }
//  }
//});

outinzadminApp.directive('emailValidation',function(){
  return {
    restrict: 'AE',
    require : 'ngModel',
    link    : function($scope,elem,attrs,ngModel){
      ngModel.$validators.emailNotFound = function(){
        return true;
      };
    }
  }
});

outinzadminApp.controller('authenticateCtrl',['$scope','$http',function($scope,$http){

  $scope.authPending = false;
  $scope.authAction = function authAction(formData, validity){
    if(validity){
      $scope.authPending = true;
      $http.post('/login',formData)
        .success(function(){
          console.log('success:: ',arguments);
          $scope.authPending = false;
          console.log($scope.authPending);
        })
        .error(function(answ,status){
            $scope.authPending = false;
            console.log($scope.authPending);
            if(!answ){
              return false;
            }
            if(answ.typeError && (answ.typeError == 1)){
              $scope.authForm.email.$setValidity('emailNotFound',false);
            } else {
              $scope.authForm.email.$setValidity('emailNotFound',true);
            }
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

outinzadminApp.controller('CreatePasswordController',['$scope','$http',function($scope,$http){

  $scope.authAction = function authAction(formData,validity){
    if(validity){
      console.log($scope.form);
    }
  }

}]);
