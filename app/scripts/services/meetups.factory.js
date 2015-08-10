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

    function query(id) {
      if (!id) {return false;}
      return syncData.array('meetups/' + id).$loaded();
    }

    function get(meetup) {
      if (!meetup) { return false; }
      return syncData.object('meetups/' + meetup.wakeId + '/' + meetup.id).$loaded();
    }

    function create(meetup) { 
      return FirebaseModels.createRef('meetups/' + meetup.wakeId, meetup).then(function(meetupRef){
        return $q.all([
          FirebaseModels.createUserAssociation('users', 'meetups/' + meetup.wakeId, meetupRef, 'set'),
          FirebaseModels.createTask({'_state':'new_meetup','meetupId':meetupRef,'wakeId':meetup.wakeId})
        ]);
      });
    }

    function remove(meetup) {

    }
  }
})();