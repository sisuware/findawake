(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('SignupSuccessController', SignupSuccessController);

  SignupSuccessController.$inject = ['$scope', 'profile', '$location'];

  function SignupSuccessController($scope, profile, $location) {
    $scope.loading = true;
    $scope.profile = profile;

    // SimpleLogin.createProfile($scope.user.uid, $scope.user.email).then(function(user) {
    //   Users.createPublicProfile(user).then(function(res){
    //     $location.path('/welcome');
    //   }, function(res){
    //     console.debug('error creating public profile: ', res);
    //   }).finally(function(){
    //     $scope.loading = false;
    //   });
    // });
  }
})();