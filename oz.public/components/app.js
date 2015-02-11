var oz = angular.module('oz', ['ngMessages','ui.router']);

// Directive-s
// Footer block
oz.directive('footerBlock',function(){
  return {
    templateUrl: "/components/shared/footer/footer.html"
  }
});