(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Hashes', Hashes);

  Hashes.$inject = ['syncData'];

  function Hashes(syncData) {
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