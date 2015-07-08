(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesNewController', WakesNewController);

  WakesNewController.$inject = ['$scope', 'Wakes', 'auth'];

  function WakesNewController($scope, Wakes, auth) {
    $scope.wake = {};
    $scope.auth = auth;
    $scope.submit = submit;

    function submit(){
      $scope.errors = false;
      $scope.saving = true;
      
      Wakes.create($scope.wake).then(function(res) {
        //$location.path('/');
      }, function(res) {
        $scope.errors = res;
      }).finally(function(){
        $scope.saving = false;
      });
    }

    function _defaultValues() {
      $scope.wake.userId = auth.$id;
    } 

    _defaultValues();
  }
})();