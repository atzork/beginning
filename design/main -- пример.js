/**
 * Created by sergey on 2/2/15.
 */


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
