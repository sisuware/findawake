(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('SignupSuccessController', SignupSuccessController);

  SignupSuccessController.$inject = ['$scope', 'auth'];

  function SignupSuccessController($scope, auth) {
    function _createProfile() {
      $scope.creatingProfile = true;
      
      SimpleLogin.loginPassword($scope.email, $scope.pass, function(error, user) {
        if (error) {
          $scope.creatingProfile = false;
          $scope.error = error;
          return false;
        }

        SimpleLogin.createProfile(user.id, user.email).then(function(user) {
          Users.createPublicProfile(user).then(function(){
            $location.path('/welcome');
          });
        });
      });
    }
  }
})();