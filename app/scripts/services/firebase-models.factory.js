(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('FirebaseModels', FirebaseModels);

  FirebaseModels.$inject = ['firebaseRef', '$q', 'SimpleLogin'];

  function FirebaseModels(firebaseRef, $q, SimpleLogin) {
    var _currentUser;

    var service = {
      createRef: createRef,
      createUserAssociation: createUserAssociation,
      removeUserAssociation: removeUserAssociation
    };

    return service;

    function createRef(target, data){
      var dfr = $q.defer(),
          ref = firebaseRef(target).push(),
          refData = JSON.parse(angular.toJson(data));

      ref.set(_.assign(refData, {'id': ref.key()}), function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve(ref.key());
        }
      });

      return dfr.promise;
    }

    function createUserAssociation(root, target, ref, method){
      _auth();
      var dfr = $q.defer();

      firebaseRef(root + '/' + _currentUser.uid + '/' + target)[method](ref, function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve();
        }
      });

      return dfr.promise; 
    }

    function removeUserAssociation(root, target, ref){
      _auth();
      var dfr = $q.defer();

      firebaseRef(root + '/' + _currentUser.uid + '/' + target + '/' + ref).remove(function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve();
        }
      });

      return dfr.promise;
    }

    function _auth() {
      if (!_currentUser) {
        _currentUser = SimpleLogin.currentUser();
      }
      return _currentUser;
    }
  }
})();