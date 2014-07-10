'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('WakeCtrl', function(
  $scope, 
  wake, 
  auth, 
  $modal,
  $location
){
  $scope.wake = wake;
  $scope.auth = auth;

  $scope.removeWake = function(wake){
    var modalInstance = $modal.open({
      templateUrl: '/views/wakes/removeModal.html',
      controller: 'DeleteWakeCtrl',
      size: 'sm',
      resolve: {
        wake: function () {
          return wake;
        }
      }
    });

    modalInstance.result.then(function(res){
      if(!res){
        $location.path('/wakes');
      }
    });
  };
});

app.controller('EditWakeCtrl', function(
  $scope, 
  WakeSettings, 
  $window,
  Imgur,
  wake, 
  auth
){
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
});


app.controller('NewWakeCtrl', function(
  $scope,
  $timeout,
  WakeSettings,
  Wakes,
  Imgur,
  auth
){
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
      Wakes.create($scope.wake);
    });
    
  };
});

app.controller('DeleteWakeCtrl', function(
  $scope,
  $modalInstance,
  wake,
  Wakes
){
  $scope.wake = wake;

  $scope.delete = function(){
    Wakes.remove(wake).then(function(res){
      $modalInstance.close(res);
    });
  };

  $scope.cancel = function(){
    $modalInstance.dismiss();
  };
});