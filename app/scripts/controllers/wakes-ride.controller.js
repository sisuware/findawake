(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesRideController', WakesRideController);

  WakesRideController.$inject = ['$scope', 'auth', 'wake', 'Meetups', '$location'];

  function WakesRideController($scope, auth, wake, Meetups, $location) {
    $scope.wake = wake;
    $scope.auth = auth;
    $scope.submit = submit;

    function submit() {
      $scope.errors = false;
      $scope.processing = true;

      Meetups.create($scope.meetup).then(function(ref){
        $location.path('/meetups/' + ref.id);
      }, function(errors){
        $scope.errors = errors;
      }).finally(function(){
        $scope.processing = false;
      });
    }

    function _defaultValues() {
      $scope.meetup = {};
      $scope.meetup.wakeId = wake.id;
      $scope.meetup.userId = auth.uid;
    }

    _defaultValues();
    
    // information needed
    // a date and time
    // a specific location
    // 

  }
})();