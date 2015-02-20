/**
 * Created by sergey on 2/9/15.
 * Create Password Directives
 */
var oz = oz || {};
// oz.passwordValidation
oz.directive('passwordValidation', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      ngModel.$validators.passwordFormat = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        var result = true;
        var regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(.{7,})$/g;

        if (!value) {
          return result;
        }

        result = regExp.test(value);
        return result;
      };
    }
  };
});