'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */

var app = angular.module('findawakeApp');

app.factory('Wakes', function(
  syncData
){
  var wakesService = {};

  wakesService.query = function(){
    return syncData('pulls');
  };

  wakesService.create = function(){

  };

  return wakesService;
});

app.factory('WakeCreator', function(
  firebaseRef,
  $timeout
){
  return function(id, args, callback) {
    firebaseRef('wakes/' + id).set(args, function(err) {
      //err && console.error(err);
      if( callback ) {
        $timeout(function() {
          callback(err);
        });
      }
    });
  };
});

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
 /*
var app = angular.module('findawakeApp');

app.service('Pulls', function (
  $timeout,
  $location,
  FIREBASE_URL,
  angularFireCollection,
  angularFire,
  ImgurManager
){
  var pullsService = {}, client = new Firebase(FIREBASE_URL), imgur = new ImgurManager();

  pullsService.get = function(user){
    if(user){
      return angularFire(FIREBASE_URL + 'users/' + user + '/pulls', $scope, 'pulls', {});
    } else {
      return angularFireCollection(FIREBASE_URL+'pulls');
    }
  };

  pullsService.add = function(){
    var auth = $scope.auth,
    newPull = _client.child('/pulls').push();

    newPullData = {
      id: newPull.name(),
      boat: $scope.boat,
      schedule: $scope.schedules,
      pulltypes: $scope.pulltypes,
      location: $scope.location,
      user_id: auth.user,
      thumbnail: undefined
    };

    _imgur.uploadImage($scope.thumbnail, function(data){
      newPullData.thumbnail = data.data.link;
      _setData();
    });

    var _setData = function(){
      newPull.set(JSON.parse(angular.toJson(newPullData)), function(error){
        if(error){
          $scope.loading = false;
          $scope.$broadcast('pulls.add.error', {error: error});
        } else {
          $scope.loading = false;
          _client.child('/users/'+auth.user+'/pulls/'+newPull.name()).set({id:newPull.name()});
          $scope.$broadcast('pulls.add.success', {pull: newPull.name()});
        }
      });
    };
  };

  pullsService.remove = function(){
    var auth = $scope.auth;
            if(pullId){
              _client.child('/pulls/'+pullId).remove(function(error){
                if(error){
                  $scope.$broadcast('pulls.remove.error', {error: error});
                } else {
                  _client.child('/users/'+auth.user+'/pulls/'+pullId).remove();
                  $scope.$broadcast('pulls.remove.success', {});
                }
              });
            }
  };

  pullsService.request = function(){
    $scope.loading = true;
            var auth = $scope.auth,
            newRequest = _client.child('/pulls/'+pullId+'/requests').push();

            newRequest.set(JSON.parse(angular.toJson($scope.request)), function(error){
              if(error){
                $timeout(function(){
                  $scope.loading = false;
                });
                $scope.$broadcast('requests.add.error', {error: error});
              } else {
                $timeout(function(){
                  $scope.loading = false;
                });
                _client.child('/users/'+auth.user+'/requests/'+newRequest.name()).set({id:newRequest.name()});
                $scope.$broadcast('requests.add.success', {pull: newRequest.name()});
              }
            })
  };

  return pullsService;

  
});
*/