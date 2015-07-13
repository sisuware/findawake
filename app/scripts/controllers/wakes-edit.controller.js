(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesEditController', WakesEditController);

  WakesEditController.$inject = ['$scope', 'wake', 'auth', '$location'];

  function WakesEditController($scope, wake, auth, $location) {
    $scope.auth = auth;
    $scope.wake = wake;

    $scope.update = update;

    function update() {
      $scope.errors = false;
      $scope.saving = true;
      
      $scope.wake.$save().then(function(res){
        //$location.path('/wakes/' + res.id);
      }, function(res){
        $scope.errors = res;
      }).finally(function(){
        $scope.saving = false;
      });
    }
  }
})();