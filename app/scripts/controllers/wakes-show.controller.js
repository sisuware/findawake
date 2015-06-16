(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesShowController', WakesShowController);

  WakesShowController.$inject = ['$scope', 'WakeSettings', '$window', 'Imgur', 'Wakes', 'wake'];

  function WakesShowController($scope, WakeSettings, $window, Imgur, Wakes, wake) {
    $scope.wake = wake;

  }
})();