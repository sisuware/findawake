(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesNewController', WakesNewController);

  WakesNewController.$inject = ['$scope', '$timeout', '$location', 'WakeSettings', 'Wakes', 'Imgur', 'auth'];

  function WakesNewController($scope, $timeout, $location, WakeSettings, Wakes, Imgur, auth) {
    $scope.auth = auth;
    WakeSettings.init($scope);

    $scope.addSchedule = function(schedule){
      $scope.wake.schedules.push(angular.copy(schedule));
    };

    $scope.removeSchedule = function(index){
      $scope.wake.schedules.splice(index, 1);
    };

    $scope.validateLocation = function(){
      $scope.validating = true;
      WakeSettings.validateLocation($scope.location, function(res){
        $scope.validating = false;
        $scope.validatedLocations = res;
      });
    };

    $scope.submit = function(){
      $scope.saving = true;
      $scope.wake.userId = auth.id;
      Imgur.upload($scope.thumbnail).then(function(res){
        if(res.data){
          $scope.wake.thumbnail = res.data.link;
        }
      }).finally(function(){
        Wakes.create($scope.wake).then(function(){
          $location.path('/');
        });
      });
      
    };
  }
})();