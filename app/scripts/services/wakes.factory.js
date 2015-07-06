/*global google:false */

(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Wakes', Wakes);

  Wakes.$inject = ['syncData', 'FirebaseModels','$q'];

  function Wakes(syncData, FirebaseModels, $q) {
    

    var service = {
      query: query,
      get: get,
      remove: removeWake,
      create: createWake,
      updateLocation: updateLocation,
      getDistance: getDistance
    };

    return service;

    function query() {
      return syncData('wakes').$loaded();
    }

    function get(id) {
      return syncData('wakes/' + id).$loaded();
    }

    function removeWake(wake) {
      return $q.all([
        FirebaseModels.removeUserAssociation('users', 'wakes', wake.id),
        FirebaseModels.removeUserAssociation('profiles', 'wakes', wake.id)
      ]).then(function(){
        return wake.$remove();
      });
    }

    function createWake(wake) {
      /*jshint camelcase: false */
      return FirebaseModels.createRef('wakes', wake).then(function(wakeRef){
        return $q.all([
          FirebaseModels.createUserAssociation('users', 'wakes', wakeRef, 'push'),
          FirebaseModels.createUserAssociation('profiles', 'wakes', wakeRef, 'push'),
          //FirebaseModels.createUserAssociation('locations', wake.location.administrative_area_level_2, wake.location.administrative_area_level_1, wakeRef, 'push')
        ]);
      });
    }

    function updateLocation(wake) {
      /*jshint camelcase: false */
      //return FirebaseModels.createUserAssociation('locations', wake.location.administrative_area_level_2, wake.location.administrative_area_level_1, wake.id, 'push');
    }

    function getDistance(current, target) {
      var fromLatLng = new google.maps.LatLng(current.lat, current.lng);
      var toLatlng = new google.maps.Latlng(target.lat, target.lng);

      return Math.round(google.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatlng) * 0.000621371192);
    }

    function _handleError(error) {
      console.debug(error);
    }
  }
})();