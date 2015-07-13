(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('SignupSuccessController', SignupSuccessController);

  SignupSuccessController.$inject = ['$scope', 'auth', 'SimpleLogin', 'Users', '$location'];

  function SignupSuccessController($scope, auth, SimpleLogin, Users, $location) {
    $scope.loading = true;
    $scope.user = auth;

    SimpleLogin.createProfile($scope.user.id, $scope.user.email).then(function(user) {
      Users.createPublicProfile(user).then(function(res){
        $location.path('/welcome');
      }, function(res){
        console.debug('error creating public profile: ', res);
      }).finally(function(){
        $scope.loading = false;
      });
    });
  }
})();