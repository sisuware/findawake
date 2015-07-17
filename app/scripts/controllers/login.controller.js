(function(){
  'use strict';

  angular
   .module('findAWake')
   .controller('LoginController', LoginController);

   LoginController.$inject = ['$scope', 'SimpleLogin','$location'];

  function LoginController($scope, SimpleLogin, $location){
    $scope.redirect = $location.search().redirect || false;
    $scope.login = login;
    $scope.loginPassword = loginPassword;


    function login(service) {
      _reset();
      $scope.loading = true;
      
      SimpleLogin.login(service).then(_handleSuccess, _handleError);
    }

    function _handleSuccess() {
      console.debug('you are now logged in.');
      if ($scope.redirect) {
        $location.path($scope.redirect).search('');
      } else {
        $location.path('/');
      }
    }

    function _handleError(error) {
      $scope.loading = false;
      $scope.error = error;
    }

    function _reset() {
      $scope.error = false;
    }

    function loginPassword(cb) {
      _reset();
      $scope.loading = true;

      var invalidLogin = SimpleLogin.assertValidLoginAttempt($scope.email, $scope.pass);

      if(invalidLogin) {
        $scope.loading = false;
        $scope.error = invalidLogin;
        return false;
      }

      SimpleLogin.loginPassword($scope.email, $scope.pass).then(_handleSuccess, _handleError);
    }
  }
})();