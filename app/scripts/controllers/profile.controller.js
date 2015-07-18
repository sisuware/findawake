(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope','profile'];

  function ProfileController($scope, profile){
    $scope.profile = profile;
  }
  
})();
