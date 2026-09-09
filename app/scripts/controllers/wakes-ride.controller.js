(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'wake', 'Requests', '$location', 'auth'];

  function WakesRideController($scope, wake, Requests, $location, auth) {
    $scope.auth = auth;
    $scope.wake = wake;
    $scope.request = {};

    $scope.submit = function(){
      // $scope.request.userId = auth.userId;
      // $scope.request.wakeId = wake.id;
      // Wakes.request($scope.request);
      $scope.loading = true;

      Requests.create($scope.request).then(function(data){
        console.log('request success');
      }, function(ref){
        $scope.error = ref;
      }).finally(function(){
        $scope.loading = false;
      });
    };

    function _defaultValues() {
      var hash = $location.hash();

      if (hash) {
        $scope.request.types = {};
        $scope.request.types[hash] = true;
      }

      $scope.request.expenses = 20;
      $scope.request.wakeId = wake.id;  
      $scope.request.userId = auth.uid;
    }

    _defaultValues();
  }
})();