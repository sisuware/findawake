'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('ProfileCtrl', function(
  $scope, 
  Wakes,
  profile,
  auth
){
  $scope.profile = profile;
  $scope.auth = auth;
  $scope.wakes = [];

  angular.forEach($scope.profile.wakes, function(wake){
    console.log(wake);
    $scope.wakes.push(Wakes.get(wake));
  });
});