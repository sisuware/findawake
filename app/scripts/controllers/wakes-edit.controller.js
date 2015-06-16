(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesEditController', WakesEditController);

  WakesEditController.$inject = ['$scope', 'WakeSettings', '$window', 'Imgur', 'Wakes', 'wake', 'auth'];

  function WakesEditController($scope, WakeSettings, $window, Imgur, Wakes, wake, auth) {
    var origWake = angular.copy(wake);
    $scope.auth = auth;
    $scope.wake = wake;

    WakeSettings.init($scope);

    if(wake.userId !== auth.id){
      $window.history.back();
    }

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

    $scope.update = function(){
      $scope.saving = true;

      if(origWake.location !== $scope.wake.location) {
        Wakes.updateLocation($scope.wake);
      }

      if(!$scope.wake.thumbnail){
        Imgur.upload($scope.thumbnail).then(function(res){
          if(res.data){
            $scope.wake.thumbnail = res.data.link;
          }
        }).finally(function(){
          $scope.wake.$save();
        });
      } else {
        $scope.wake.$save();
      }    
    };
  }
})();