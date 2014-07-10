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

app.controller('WakeCtrl', function($scope, wake){
  $scope.wake = wake;
});


app.controller('NewWakeCtrl', function(
  $scope,
  $timeout,
  WakeSettings,
  Wakes,
  Imgur,
  auth
){
  var validationTimeout;
  $scope.auth = auth;
  WakeSettings.init($scope);

  $scope.addSchedule = function(schedule){
    $scope.wake.schedules.push(angular.copy(schedule));
  };

  $scope.removeSchedule = function(index){
    $scope.wake.schedules.splice(index, 1);
  };

  $scope.validateLocation = function(){
    /*jshint camelcase: false */
    var l = $scope.location;
    if(_.isEmpty(l) || _.isEmpty(l.city) || _.isEmpty(l.state)) { return false; }

    if(!_.isUndefined(validationTimeout)){
      $timeout.cancel(validationTimeout);
      validationTimeout = undefined;
    }
    validationTimeout = $timeout(function(){
      $scope.validating = true;
      WakeSettings.geocode(l).then(function(res){
        $scope.validatedLocations = res;
      }).finally(function(){
        $scope.validating = false;
      });
    }, 1000);
  };

  $scope.submit = function(){
    $scope.saving = true;
    $scope.wake.userId = auth.id;
    $scope.wake.location = JSON.parse($scope.wake.location);
    Imgur.upload($scope.thumbnail).then(function(res){
      if(res.data){
        $scope.wake.thumbnail = res.data.link;
      }
    }).finally(function(){
      Wakes.create($scope.wake);
    });
    
  };

});