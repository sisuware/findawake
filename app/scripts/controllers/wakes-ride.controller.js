(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'wake', 'Wakes'];

  function WakesRideController($scope, wake, Wakes) {
    $scope.wake = wake;
  }
})();