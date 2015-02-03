/**
 * Created by sergey on 2/2/15.
 */
var app = angular.module("app",[]);

app.controller('authenticateCtrl',['$scope',function($scope){
  $scope.authAction = function(){
    console.log('ОТПРАВИТЬ');
    console.log($scope.auth);
    $scope.auth.action = '/registration';
    return false;
  }
}]);