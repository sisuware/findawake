(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesIndexController', WakesIndexController);

  WakesIndexController.$inject = ['$scope','wakes'];

  function WakesIndexController($scope, wakes) {
    $scope.wakes = wakes;
  }
})();