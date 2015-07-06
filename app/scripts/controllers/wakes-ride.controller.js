(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'wake', 'Wakes', '$location', 'auth'];

  function WakesRideController($scope, wake, Wakes, $location, auth) {
    $scope.auth = auth;
    $scope.wake = wake;
    $scope.request = {};

    $scope.submit = function(){
      // $scope.request.userId = auth.userId;
      // $scope.request.wakeId = wake.id;
      // Wakes.request($scope.request);
      $scope.loading = true;

      Wakes.requestRide($scope.request).then(function(data){
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
        $scope.request.type = {};
        $scope.request.type[hash] = {selected: true};
      }

      $scope.request.wakeId = wake.id;  
      $scope.request.userId = auth.uid;
    }

    _defaultValues();
  }
})();