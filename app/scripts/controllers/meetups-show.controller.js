(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('MeetupsShowController', MeetupsShowController);

  MeetupsShowController.$inject = ['$scope', 'meetup'];

  function MeetupsShowController($scope, meetup) {
    $scope.meetup = meetup;
  }
})();