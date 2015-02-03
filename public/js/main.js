/**
 * Created by sergey on 2/2/15.
 */
var app = angular.module("app",['ngMessages']);

//app.directive('recordAvailabilityValidator',['$http',function($http) {
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

app.directive('loginValidator',function() {
  return {
    restrict: 'AE',
    require : 'ngModel',
    link    : function($scope,elem,attrs,ngModel) {
      ngModel.$validators.login = function(modelValue,viewValue) {
        var value = modelValue || viewValue;
        if(!value){
          return;
        }
        return /^[a-zA-Z0-9]+$/.test(value);
      }
    }
  }  
});

//app.constant("validationClassConfig",{
//  validClass: "has-success",
//  invalidClass: "has-error"
//});
//
//app.directive("validationClassFor",["validationClassConfig",function(validationClassConfig){
//
//
//}]);

app.controller('authenticateCtrl',['$scope',function($scope){
  $scope.authAction = function(){
    console.log('ОТПРАВИТЬ');
    console.log($scope.auth);
    $scope.auth.action = '/registration';
    return false;
  }
}]);