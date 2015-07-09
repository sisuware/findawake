/*jshint camelcase: false */

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
      update: updateWake
    };

    return service;

    function query() {
      return syncData('wakes').$loaded();
    }

    function get(id) {
      return syncData('wakes/' + id).$loaded();
    }

    function updateWake(wake) {

    }

    function removeWake(wake) {
      return $q.all([
        FirebaseModels.removeUserAssociation('users', 'wakes', wake.id),
        FirebaseModels.removeUserAssociation('profiles', 'wakes', wake.id),
        FirebaseModels.removeLocationAssociation(_state(wake), _city(wake), wake.id)
      ]).then(function(){
        return wake.$remove();
      });
    }

    function createWake(wake) {
      return FirebaseModels.createRef('wakes', wake).then(function(wakeRef){
        return $q.all([
          FirebaseModels.createUserAssociation('users', 'wakes', wakeRef, 'push'),
          FirebaseModels.createUserAssociation('profiles', 'wakes', wakeRef, 'push'),
          FirebaseModels.createLocationAssociation(_state(wake), _city(wake), wakeRef)
        ]);
      });
    }

    function _city(wake) {
      return wake.location.locality || wake.location.administrative_area_level_2;
    }

    function _state(wake) {
      return wake.location.administrative_area_level_1;
    }

    function _handleError(error) {
      console.debug(error);
    }
  }
})();