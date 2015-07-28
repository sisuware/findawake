(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersEditController', UsersEditController);

  UsersEditController.$inject = ['$scope','$timeout','Users','profile'];

  function UsersEditController($scope, $timeout, Users, profile){
    $scope.profile = profile;
    $scope.updateProfile = updateProfile;
    $scope.resendVerifyEmail = resendVerifyEmail;

    function updateProfile() {
      $scope.errors = false;
      $scope.savingProfile = true;
      $scope.profileSaved = false;

      Users.updateProfile($scope.profile).then(function(){
        $scope.profileSaved = true;
      }, function(errors){
        $scope.errors = errors;
      }).finally(function(){
        $scope.savingProfile = false;
        resetUpdateState();
      });
    }

    function resetUpdateState() {
      $timeout(function(){
        $scope.profileSaved = false;
      }, 500);
    }

    function resendVerifyEmail() {
      $scope.sending = true;
      Users.resendVerifyEmail($scope.profile.$id).finally(function(){
        $scope.sending = false;
      });
    }
  }
})();