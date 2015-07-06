(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'wake', 'Wakes'];

  function WakesRideController($scope, wake, Wakes) {
    $scope.wake = wake;

    $scope.submit = function(){
      // $scope.request.userId = auth.userId;
      // $scope.request.wakeId = wake.id;
      // Wakes.request($scope.request);
    };
  }
})();