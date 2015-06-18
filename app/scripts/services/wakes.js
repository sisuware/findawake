/*global google:false */

(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Wakes', Wakes);

  Wakes.$inject = ['syncData', 'firebaseRef', '$timeout', '$q'];

  function Wakes(syncData, firebaseRef, $timeout, $q) {
    var _currentUser;

    var service = {
      query: query,
      get: get,
      requests: requests,
      remove: removeWake,
      create: createWake,
      updateLocation: updateLocation,
      getDistance: getDistance,
      requested: requested,
      requestRide: requestRide
    };

    return service;

    function query() {
      return syncData('wakes').$loaded();
    }

    function get(id) {
      return syncData('wakes/' + id).$loaded();
    }

    function requests(id) {
      return syncData('requests/' + id).$loaded();
    }

    function requested() {
      // if(_.isUndefined(auth) || _.isEmpty(auth)){ return false; }
      // if(_.isObject(auth.requests)){
      //   return !_.isUndefined(auth.requests[wake.id]);
      // }
      // if(_.isArray(auth.requests)){
      //   return _.indexOf(auth.requests, wake.id) === -1;
      // }
      _currentUser.then(function(auth){

      });
    }

    function requestRide(wake) {  
      return _currentUser.then(function(auth){
        
        var datum = angular.copy(wake);
        datum.userId = auth.uid;

        return _createRef('requests/' + wake.id, datum).then(function(requestRef){
          return _createAssociation('users', 'requests/' + wake.id, auth.uid, requestRef, 'set');
        }, _handleError);
      }, _handleError);
    }

    function removeRideRequest() {

    }

    function removeWake(wake) {
      return $q.all([
        _removeAssociation('users', 'wakes', wake.userId, wake.id),
        _removeAssociation('profiles', 'wakes', wake.userId, wake.id)
      ]).then(function(){
        return wake.$remove();
      });
    }

    function createWake(wake) {
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

    function _auth() {
      if (!_currentUser) {
        _currentUser = SimpleLogin.currentUser();
      }
      return _currentUser;
    }

    function _handleError(error) {
      console.debug(error);
    }
  }
})();
