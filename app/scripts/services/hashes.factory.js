(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Hashes', Hashes);

  Hashes.$inject = ['syncData','FirebaseModels','$q','Users'];

  function Hashes(syncData, FirebaseModels, $q, Users) {
    var service = {
      get: get
    };

    return service;

    function get(id) {
      if (!id) { return false; }
      return syncData.object('hashes/' + id).$loaded();
    }
  }
})();