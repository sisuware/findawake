(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('syncData', syncData);

  syncData.$inject = ['$firebaseObject', 'firebaseRef'];

  function syncData($firebaseObject, firebaseRef) {
    return function (path, limit) {
      var ref = firebaseRef(path);
      if( limit ) {
        ref = ref.limit(limit);
      }
      return $firebaseObject(ref);
    };
  }
})();