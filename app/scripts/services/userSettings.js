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

app.factory('UserSettings', function(){
  var usersSettingsService = {};

  usersSettingsService.init = function($scope){
    assertProfile($scope.profile);

    if(_.isUndefined($scope.profile.gear)) {
      $scope.profile.gear = [];
    }

    $scope.gearTypes = listGearTypes();
  };

  function listGearTypes(){
    return  ['Wakeboard','Wakesurf','Wakeskate','Helmet','Bindings','Camera','Handle','Rope','Fins','Shoes','Vest'];
  }

  function assertProfile(profile){
    if(_.isUndefined(profile) || _.isNull(profile)) { throw new Error('Profile must be loaded before calling UserSettings'); }
    
    // these are required and never should be empty, but in case the profile was deleted this will re-create it.
    if(_.isUndefined(profile.email) && _.isUndefined(profile.id) && _.isUndefined(profile.name)) {
      //SimpleLogin.currentUser().then(function(user){
      //  SimpleLogin.createProfile(user.id, user.email);
      //});
    }
  }



  return usersSettingsService;
});