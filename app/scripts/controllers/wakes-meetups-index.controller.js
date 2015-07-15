(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesMeetupsIndexController', WakesMeetupsIndexController);

  WakesMeetupsIndexController.$inject = ['$scope', 'meetups', 'wake'];

  function WakesMeetupsIndexController($scope, meetups, wake) {
    $scope.meetups = meetups;
    $scope.wake = wake;
  }
})();