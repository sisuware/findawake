(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'auth', 'wake'];

  function WakesRideController($scope, auth, wake) {
    $scope.wake = wake;
    $scope.auth = auth;

    $scope.meetup = {}
    // information needed
    // a date and time
    // a specific location
    // 

  }
})();