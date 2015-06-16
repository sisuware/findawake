(function(){
  'use strict';

  angular
    .module('angularfire.firebase', ['firebase'])
    .factory('firebaseRef', firebaseRef)
    .factory('syncData', syncData);

  firebaseRef.$inject = ['Firebase', 'FBURL'];
  syncData.$inject = ['$firebaseObject', 'firebaseRef'];

  function firebaseRef (Firebase, FBURL) {
    return function () {
      return new Firebase(_pathRef([FBURL].concat(Array.prototype.slice.call(arguments))));
    };

    function _pathRef(args) {
      for (var i = 0; i < args.length; i++) {
        if (typeof(args[i]) === 'object') {
          args[i] = _pathRef(args[i]);
        }
      }
      return args.join('/');
    }
  }

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
