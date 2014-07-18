'use strict';
/*global _:false */

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
  $location,
  Users
){
  $scope.auth = auth;
  $scope.wake = wake.$on('value', function(dataSnapshot){
    $scope.profile = Users.getProfile(dataSnapshot.snapshot.value.userId);
  });

  $scope.requestRide = function(){
    if(_.isUndefined($scope.auth)){
      authModal();
    } else {
      requestRideModal();
    }
  };

  $scope.rideRequested = function(){
    if(_.isUndefined(auth) || _.isEmpty(auth)){ return false; }
    if(_.isObject(auth.requests)){
      return !_.isUndefined(auth.requests[wake.id]);
    }
    if(_.isArray(auth.requests)){
      return _.indexOf(auth.requests, wake.id) === -1;
    }
  };

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

  function authModal(){
    var modalInstance = $modal.open({
      templateUrl: '/views/loginModal.html',
      controller: 'LoginModalCtrl',
      size: 'md'
    });

    modalInstance.result.then(function(){

    });
  }

  function requestRideModal(){
    var modalInstance = $modal.open({
      templateUrl: '/views/wakes/requestModal.html',
      controller: 'RequestCtrl',
      size: 'lg',
      resolve: {
        auth: function(){
          return $scope.auth;
        },
        wake: function(){
          return $scope.wake;
        }
      }
    });

    modalInstance.result.then(function(){

    });
  }

});

app.controller('EditWakeCtrl', function(
  $scope, 
  WakeSettings, 
  $window,
  Imgur,
  Wakes,
  wake, 
  auth
){
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
});


app.controller('NewWakeCtrl', function(
  $scope,
  $timeout,
  $location,
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
      Wakes.create($scope.wake).then(function(){
        $location.path('/');
      });
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