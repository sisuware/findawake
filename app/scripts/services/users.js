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

app.factory('Users', function(
  syncData,
  firebaseRef,
  $timeout
){
  var usersService = {};

  usersService.get = function(id){
    return syncData('users/' + id);
  };

  usersService.getProfile = function(id){
    return syncData('profiles/' + id);
  };

  usersService.updatePublicProfile = function(user){
    var profile = firebaseRef('profiles/' + user.userId);
    
    profile.update(
      _.assign(JSON.parse(angular.toJson(_.pick(user, 'avatar','bio','gear','location','name','boats'))))
    );
  };

  usersService.createPublicProfile = function(user, callback){
    var profile = firebaseRef('profiles/' + user.id);
    
    profile.set(
      _.assign(JSON.parse(angular.toJson(_.pick(user, 'name')))), function(err){
        if(callback){
          $timeout(function(){
            callback(err);
          });
        }
      }
    );
  };

  return usersService;
});