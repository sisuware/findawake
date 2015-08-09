(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('MeetupsIndexController', MeetupsIndexController);

  MeetupsIndexController.$inject = ['$scope', 'meetups', 'wake'];

  function MeetupsIndexController($scope, meetups, wake) {
    $scope.meetups = meetups;
    $scope.wake = wake;
    $scope.futureOrPast = futureOrPast;

    function futureOrPast(date) {
      
    }
  }
})();