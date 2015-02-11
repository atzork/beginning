/**
 * Created by sergey on 2/9/15.
 * Create Password Directives
 */

// oz.passwordValidation
oz.directive('passwordValidation',function(){
  return {
    require : 'ngModel',
    link    : function($scope,elem,attrs,ngModel) {
      ngModel.$validators.passwordFormat = function(modelValue,viewValue) {
        var value = modelValue || viewValue;
        var result= true;
        //var regExp= /^([0-9]+)|([a-z]+)|([A-Z]+)$/g;
        var regExp= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(.{7,})$/g;

        if(!value){
          return;
        }

        result = regExp.test(value);
        return result;
      };

      ngModel.$validators.matchePasswords = function(modelValue,viewValue) {
        var value = modelValue || viewValue;
        var result= true;
        if(!value){
          return;
        }

        var passwordValue   = $scope.authForm.password.$viewValue;
        var repasswordValue = $scope.authForm.repassword.$viewValue;

        if( (typeof passwordValue !== 'undefined') && (typeof repasswordValue !== 'undefined')) {
          result = passwordValue === repasswordValue;
        }

        $scope.authForm.password.$setValidity('matchePasswords',result);
        $scope.authForm.repassword.$setValidity('matchePasswords',result);

        return result;
      };
    }
  }
});