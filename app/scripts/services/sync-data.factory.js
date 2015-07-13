(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('syncData', syncData);

  syncData.$inject = ['$firebaseObject', '$firebaseArray','firebaseRef'];

  function syncData($firebaseObject, $firebaseArray, firebaseRef) {
    var service = {
      array: array,
      object: object
    };

    return service;

    function array(path, limit) {
      var ref = firebaseRef(path);

      return $firebaseArray(ref);
    }

    function object(path, limit) {
      var ref = firebaseRef(path);

      return $firebaseObject(ref);
    }

    // return function (path, limit) {
    //   var ref = firebaseRef(path);
    //   if( limit ) {
    //     ref = ref.limit(limit);
    //   }
    //   return $firebaseObject(ref);
    // };
  }
})();