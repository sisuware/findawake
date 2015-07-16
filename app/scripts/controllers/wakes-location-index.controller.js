(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesLocationIndexController', WakesLocationIndexController);

  WakesLocationIndexController.$inject = ['$scope','wakes','$routeParams'];

  function WakesLocationIndexController($scope, wakes, $routeParams) {
    $scope.wakes = wakes;
    $scope.state = $routeParams.state;
    $scope.city = $routeParams.city;
  }
})();