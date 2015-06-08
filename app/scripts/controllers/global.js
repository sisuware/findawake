'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findAWake');

app.controller('NavCtrl', function(
  $scope, 
  SimpleLogin
){
  SimpleLogin.currentUser().then(function(user){
    $scope.user = user;
  });
});