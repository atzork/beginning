/**
 * Created by sergey on 2/9/15.
 * Create Password Directives
 */

// oz.passwordValidation
oz.directive('passwordValidation',function(){
  return {
    require : 'ngModel',
    link    : function($scope,elem,attrs,ngModel) {

      ngModel.$validators.matchePasswords = function(modelValue,viewValue) {
        var result= true;
        var value= modelValue || viewValue;
        var formModel= $scope[elem[0].form.name];
        var matchField= attrs.match;
        var matchValue= '';
        if(!value || !matchField){
          return;
        }

        matchValue= formModel[matchField].$modelValue || formModel[matchField].$viewValue;
        result= value === matchValue;

        //console.log(value + ' -- ' + matchValue);

        formModel.password.$setValidity('matchePasswords',result);
        formModel.repassword.$setValidity('matchePasswords',result);

        if(result) {
          formModel.password.$modelValue= value;
          formModel.repassword.$modelValue= value;
          console.log(formModel.password);
          console.log(formModel.repassword);
        }

        return result;
      };

      ngModel.$validators.passwordFormat = function(modelValue,viewValue) {
        var value = modelValue || viewValue;
        var result= true;
        var regExp= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(.{7,})$/g;

        if(!value){
          return;
        }

        result = regExp.test(value);
        return result;
      };

    }
  }
});