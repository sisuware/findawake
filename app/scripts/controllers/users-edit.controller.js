(function(){
  'use strict';

  /**
   * @ngdoc function
   * @name findawakeApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the findawakeApp
   */
  angular
    .module('findAWake')
    .controller('UsersEditController', UsersEditController);

  UsersEditController.$inject = ['$scope','$timeout','Users','profile'];

  function UsersEditController($scope, $timeout, Users, profile){
    $scope.profile = profile;
    $scope.updateProfile = updateProfile;

    function updateProfile(){
      $scope.savingProfile = true;
      $scope.profileSaved = false;
      
      $scope.profile.$save().then(function(){
        Users.updatePublicProfile($scope.profile);
      }).finally(function(){
        $timeout(function(){
          $scope.savingProfile = false;
          $scope.profileSaved = true;
          resetUpdateState();
        },150);
      });
    }

    function resetUpdateState(){
      $timeout(function(){
        $scope.profileSaved = false;
      }, 500);
    }
  }

  // app.controller('UserWelcomeCtrl', function(
  //   $scope,
  //   profile
  // ){
  //   $scope.profile = profile;
  // });
})();
