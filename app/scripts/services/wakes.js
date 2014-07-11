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

app.factory('Wakes', function(
  syncData,
  firebaseRef,
  $timeout,
  $q
){
  var wakesService = {};

  wakesService.query = function(){
    return syncData('wakes');
  };

  wakesService.get = function(id){
    return syncData('wakes/' + id);
  };

  wakesService.requests = function(id){
    return syncData('requests/' + id);
  };

  wakesService.remove = function(wake){
    return $q.all([
      removeAssociation('users', 'wakes', wake.userId, wake.id),
      removeAssociation('profiles', 'wakes', wake.userId, wake.id)
    ]).then(function(){
      return wake.$remove();
    });
  };

  wakesService.request = function(request){
    return createRef('requests/' + request.wakeId, request).then(function(requestRef){
      createAssociation('users', 'requests/' + request.wakeId, request.userId, requestRef, 'set');
    });
  };

  wakesService.create = function(wake){
    return createRef('wakes', wake).then(function(wakeRef){
      return $q.all([
        createAssociation('users', 'wakes', wake.userId, wakeRef, 'push'),
        createAssociation('profiles', 'wakes', wake.userId, wakeRef, 'push')
      ]);
    });
  };

  function createRef(target, data){
    var dfr = $q.defer(),
        ref = firebaseRef(target).push(),
        refData = JSON.parse(angular.toJson(data));

    ref.set(_.assign(refData, {'id': ref.name()}), function(err){
      if(err){
        dfr.reject(err);
      } else {
        dfr.resolve(ref.name());
      }
    });

    return dfr.promise;
  }

  function createAssociation(root, target, id, ref, method){
    var dfr = $q.defer();

    firebaseRef(root + '/' + id + '/' + target)[method](ref, function(err){
      if(err){
        dfr.reject(err);
      } else {
        dfr.resolve();
      }
    });

    return dfr.promise; 
  }

  function removeAssociation(root, target, id, ref){
    var dfr = $q.defer();

    firebaseRef(root + '/' + id + '/' + target + '/' + ref).remove(function(err){
      if(err){
        dfr.reject(err);
      } else {
        dfr.resolve();
      }
    });

    return dfr.promise;
  }

  return wakesService;
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