(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('MeetupsIndexController', MeetupsIndexController);

  MeetupsIndexController.$inject = ['$scope', 'meetups', 'wake'];

  function MeetupsIndexController($scope, meetups, wake) {
    $scope.meetups = meetups;
    $scope.wake = wake;
    $scope.ifFuture = afterToday;

    function afterToday(date) {
      if (!date) { return false; }
      return moment(date).isAfter();
    }
  }
})();