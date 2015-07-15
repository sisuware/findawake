(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Meetups', Meetups);

  Meetups.$inject = ['syncData','FirebaseModels','$q'];

  function Meetups(syncData, FirebaseModels, $q) {
    var service = {
      get: get,
      query: query,
      create: create
    };

    return service;

    function get(id) {
      if (!id) { return false; }
      return syncData.object('meetups/' + id).$loaded();
    }

    function query() {
      return syncData.array('meetups').$loaded();
    }

    function create(meetup) { 
      return FirebaseModels.createRef('meetups/' + meetup.wakeId, meetup).then(function(requestRef){
        return FirebaseModels.createUserAssociation('users', 'meetups/' + meetup.wakeId, requestRef, 'set');
      });
    }
  }
})();