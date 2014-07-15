'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('RequestCtrl', function(
  $scope, 
  $modalInstance,
  Wakes,
  wake,
  auth
){
  $scope.request = {};
  $scope.auth = auth;
  $scope.wake = wake;

  $scope.submit = function(){
    $scope.request.userId = auth.userId;
    $scope.request.wakeId = wake.id;
    Wakes.request($scope.request);
  };

  $scope.cancel = function(){
    $modalInstance.dismiss();
  };
});