'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('NavCtrl', function(
  $scope, 
  SimpleLogin
){
  $scope.auth = SimpleLogin.currentUser();
});