(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakeMeetupsIndexController', WakeMeetupsIndexController);

  WakeMeetupsIndexController.$inject = ['$scope', 'meetups', 'wake'];

  function WakeMeetupsIndexController($scope, meetups, wake) {
    $scope.meetups = meetups;
    $scope.wake = wake;
  }
})();