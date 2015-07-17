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
      createTask: createTask,
      createUserAssociation: createUserAssociation,
      removeUserAssociation: removeUserAssociation,
      createLocationAssociation: createLocationAssociation,
      removeLocationAssociation: removeLocationAssociation
    };

    return service;

    function createRef(target, data){
      var dfr = $q.defer();
      var ref = firebaseRef(target).push();
      var refData = JSON.parse(angular.toJson(data));

      ref.set(_.assign(refData, {'id': ref.key(), 'created': Date.now()}), function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve(ref.key());
        }
      });

      return dfr.promise;
    }

    function createTask(data) {
      var dfr = $q.defer();
      var ref = firebaseRef('/queue/tasks').push();

      ref.set(data, function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve(ref.key());
        }
      });

      return dfr.promise;
    }

    function createUserAssociation(root, target, ref, method){
      var dfr = $q.defer();

      _auth().then(function(user){
        firebaseRef(root + '/' + user.uid + '/' + target)[method](ref, function(err){
          if(err){
            dfr.reject(err);
          } else {
            dfr.resolve(ref);
          }
        });
      }, function(err){
        dfr.reject(err);
      });

      return dfr.promise; 
    }

    function createLocationAssociation(state, city, ref) {
      var dfr = $q.defer();
      var path = ['locations', state, city].join('/');
      
      firebaseRef(path).push(ref, function(err){
        if (err) {
          dfr.reject(err);
        } else {
          dfr.resolve();
        }
      });

      return dfr.promise;
    }

    function removeLocationAssociation(state, city, ref) {
      var dfr = $q.defer();
      var path = ['locations', state, city, ref].join('/');
      
      firebaseRef(path).remove(function(err){
        if (err) {
          dfr.reject(err);
        } else {
          dfr.resolve();
        }
      });

      return dfr.promise; 
    }

    function removeUserAssociation(root, target, ref){
      var dfr = $q.defer();
      
      _auth().then(function(user) {
        firebaseRef(root + '/' + user.uid + '/' + target + '/' + ref).remove(function(err){
          if(err){
            dfr.reject(err);
          } else {
            dfr.resolve();
          }
        });
      }, function(err) {
        dfr.reject(err);
      });

      return dfr.promise;
    }

    function _auth() {
      if (!_currentUser) {
        _currentUser = SimpleLogin.currentUser();
      }
      return _currentUser;
    }

    function _extractNameFromEmail(email) {
      return _ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function _ucfirst (str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }
  }
})();