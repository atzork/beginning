/**
 * Created by sergey on 2/9/15.
 */
console.log('appDirectives');
console.log('outinzadminApp:: ',outinzadminApp);
outinzadminApp.directive('footerBlock',function(){
  return {
    templateUrl: "/app/shared/footer/view/footer.html"
  }
});