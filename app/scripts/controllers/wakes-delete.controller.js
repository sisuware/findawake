(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesDeleteController', WakesDeleteController);

  WakesDeleteController.$inject = ['$scope', '$modalInstance', 'wake', 'Wakes'];

  function WakesDeleteController($scope, $modalInstance, wake, Wakes) {
    $scope.wake = wake;

    $scope.delete = function(){
      Wakes.remove(wake).then(function(res){
        $modalInstance.close(res);
      });
    };

    $scope.cancel = function(){
      $modalInstance.dismiss();
    };
  }
})();