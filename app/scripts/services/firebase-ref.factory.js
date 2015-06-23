(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('firebaseRef', firebaseRef);

  firebaseRef.$inject = ['Firebase', 'FBURL'];

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
})();