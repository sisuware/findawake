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
  $q
){
  var usersService = {}, profiles = {};

  usersService.get = function(id){
    return syncData('users/' + id);
  };

  usersService.getProfile = function(id){
    if(!id){ return false; }
    if(!profiles[id]){
      profiles[id] = syncData('profiles/' + id);
    }
    return profiles[id];
  };

  usersService.updatePublicProfile = function(user){
    var profile = firebaseRef('profiles/' + user.userId);
    
    profile.update(
      _.assign(JSON.parse(angular.toJson(_.pick(user, 'avatar','bio','gear','location','name','boats'))))
    );
  };

  usersService.createPublicProfile = function(user){
    return createRef('profiles/' + user.userId, user);
  };

  function createRef(target, data){
    var dfr = $q.defer(),
        ref = firebaseRef(target),
        refData = JSON.parse(angular.toJson(_.pick(data, 'name')));

    ref.set(refData, function(err){
      if(err){
        dfr.reject(err);
      } else {
        dfr.resolve(ref.name());
      }
    });

    return dfr.promise;
  }

  return usersService;
});