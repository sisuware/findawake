'use strict';
/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('IndexCtrl', function(
  $scope, 
  $timeout, 
  auth, 
  wakes
  //geolocation,
  //Geocoder,
  //Wakes
){
  $scope.auth = auth;
  $scope.wakes = wakes;

  /*
  $scope.distances = ['5','15','25','50','100','150'];
  $scope.selectedDistance = '50';

  geolocation.getLocation().then(function(data){
    $scope.currentLocation = data.coords;
    formattedCurrentLocation(data);
  });

  $scope.selectDistance = function(distance){
    $scope.selectedDistance = distance;
  };

  $scope.isDistanceSelected = function(distance){
    return distance === $scope.selectedDistance;
  };

  $scope.filterWakes = function(wake){
    var currentLocation = $scope.currentLocation,
        wakeLocation = _.pick(wake.location, 'lat','lng');
    return Wakes.getDistance(currentLocation, wakeLocation) <= parseInt($scope.selectedDistance);
  };

  function formattedCurrentLocation(data){
    $scope.loadingLocation = true;
    Geocoder.latlng(data.coords).then(function(results){
      $scope.formattedCurrentLocation = _.first(results).formatted_address;
    }).finally(function(){
      $scope.loadingLocation = false;
    });
  }
  */

});


