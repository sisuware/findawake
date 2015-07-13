(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesNewController', WakesNewController);

  WakesNewController.$inject = ['$scope', 'Wakes', 'auth', '$location'];

  function WakesNewController($scope, Wakes, auth, $location) {
    $scope.wake = {};
    $scope.auth = auth;
    $scope.submit = submit;

    function submit(){
      $scope.errors = false;
      $scope.saving = true;
      
      Wakes.create($scope.wake).then(function(res) {
        $location.path('/wakes/' + res.id);
      }, function(res) {
        $scope.errors = res;
      }).finally(function(){
        $scope.saving = false;
      });
    }

    function _defaultValues() {
      $scope.wake.userId = auth.uid;
    } 

    _defaultValues();
  }
})();