'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findAWake');

app.controller('ProfileCtrl', function(
  $scope, 
  Wakes,
  profile,
  auth
){
  $scope.profile = profile;
  $scope.auth = auth;
  $scope.wakes = [];

  $scope.$watch('profile', function(value){
    if(!value){ return false; }

    angular.forEach($scope.profile.wakes, function(wake){
      $scope.wakes.push(Wakes.get(wake));
    });
  });
});