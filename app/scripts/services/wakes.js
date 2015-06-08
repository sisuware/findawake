/*global google:false */

(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Wakes', Wakes);

  Wakes.$inject = ['syncData', 'firebaseRef', '$timeout', '$q'];

  function Wakes(syncData, firebaseRef, $timeout, $q) {
    var service = {
      query: query,
      get: get,
      requests: requests,
      remove: remove,
      request: request,
      create: create,
      updateLocation: updateLocation,
      getDistance: getDistance
    };

    return service;

    function query() {
      return syncData('wakes');
    }

    function get(id) {
      return syncData('wakes/' + id);
    }

    function requests(id) {
      return syncData('requests/' + id);
    }

    function remove(wake) {
      return $q.all([
        _removeAssociation('users', 'wakes', wake.userId, wake.id),
        _removeAssociation('profiles', 'wakes', wake.userId, wake.id)
      ]).then(function(){
        return wake.$remove();
      });
    }

    function request(request) {
      return _createRef('requests/' + request.wakeId, request).then(function(requestRef){
        _createAssociation('users', 'requests/' + request.wakeId, request.userId, requestRef, 'set');
      });
    }

    function create(wake) {
      /*jshint camelcase: false */
      return _createRef('wakes', wake).then(function(wakeRef){
        return $q.all([
          _createAssociation('users', 'wakes', wake.userId, wakeRef, 'push'),
          _createAssociation('profiles', 'wakes', wake.userId, wakeRef, 'push'),
          _createAssociation('locations', wake.location.administrative_area_level_2, wake.location.administrative_area_level_1, wakeRef, 'push')
        ]);
      });
    }

    function updateLocation(wake) {
      /*jshint camelcase: false */
      return _createAssociation('locations', wake.location.administrative_area_level_2, wake.location.administrative_area_level_1, wake.id, 'push');
    }

    function getDistance(current, target) {
      var fromLatLng = new google.maps.LatLng(current.lat, current.lng);
      var toLatlng = new google.maps.Latlng(target.lat, target.lng);

      return Math.round(google.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatlng) * 0.000621371192);
    }

    function _createRef(target, data){
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

    function _createAssociation(root, target, id, ref, method){
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

    function _removeAssociation(root, target, id, ref){
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
  }
})();
