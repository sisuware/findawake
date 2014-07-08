'use strict';
/*global google:false */


/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('IndexCtrl', function($scope, $timeout, auth, wakes){
  $scope.auth = auth;
  $scope.wakes = wakes;

  $scope.boarding = {
    wakeboarding: true,
    wakesurfing: true,
    wakeskating: true
  };

  $scope.distances = ['5','15','25','50','100','150'];
  $scope.selectedDistance = '25';

  $scope.selectDistance = function(){
    $scope.selectedDistance = this.distance;
  };

  $scope.filterPulls = function(pull){
    //for(var key in $scope.boarding){
    //  if($scope.boarding[key] && $.grep(pull.pulltypes, function(type){return (type.name === key && type.selected);})){
    //    return _calculateDistance($scope, pull) <= parseInt($scope.selectedDistance);
    //  } else {
    //    continue;
    //  }
    //}
    return pull;
  };

  $scope.search = function(){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': $scope.location.search }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $timeout(function(){
          $scope.location.lat = results[0].geometry.location.lat();
          $scope.location.lng = results[0].geometry.location.lng();
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  //function calculateDistance($scope, pull){
  //  if($scope.location.lat && $scope.location.lng){
  //    var from = new google.maps.LatLng($scope.location.lat, $scope.location.lng),
  //    to = new google.maps.LatLng(pull.location.lat, pull.location.lng),
  //    distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(from, to) * 0.000621371192);
  //    pull.location.distance = distance;
  //    return distance;
  //  } else {
  //    return 0;
  //  }
  //};
});


