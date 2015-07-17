(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesDeleteController', WakesDeleteController);

  WakesDeleteController.$inject = ['$scope', 'wake', 'Wakes'];

  function WakesDeleteController($scope, wake, Wakes) {
    $scope.wake = wake;

    $scope.delete = function(){
      Wakes.remove(wake).then(function(res){
        
      });
    };


  }
})();