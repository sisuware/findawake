(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Users', Users);

  Users.$inject = ['syncData', 'firebaseRef', '$q'];

  function Users(syncData, firebaseRef, $q) {
    var profiles = {};

    var service = {
      get: get,
      getProfile: getProfile,
      updatePublicProfile: updatePublicProfile,
      createPublicProfile: createPublicProfile
    };

    return service; 
    
    function get(id){
      if (!id) { return false; }
      return syncData('users/' + id);
    }

    function getProfile(id){
      if(!id){ return false; }
      if(!profiles[id]){
        profiles[id] = syncData('profiles/' + id);
      }
      return profiles[id];
    }

    function updatePublicProfile(user){
      var dfr = $q.defer();
      var profile = firebaseRef('profiles/' + user.userId);
      var datum = JSON.parse(
        angular.toJson(
          _.pick(user, 'avatar','bio','gear','location','name','boats')
        )
      );

      profile.update(datum, function(error) {
        if (error) {
          console.debug('unable to update profile: ', error);
          dfr.reject(error);
        } else {
          dfr.resolve();
        }
      });

      return dfr.promise;
    }

    function createPublicProfile(user){
      // ensure user does not have a profile.
      return _checkExistingProfile(user.userId).then(function(data){
        console.debug('profile already exists');
      }, function(){
        return _createRef('profiles/' + user.userId, user);  
      });
    }

    function _createRef(target, data){
      var dfr = $q.defer();
      var ref = firebaseRef(target);
      var datum = JSON.parse(
        angular.toJson(
          _.pick(data, 'name')
        )
      );

      ref.set(datum, function(error){
        if(error){
          console.debug('unable to create reference: ', error);
          dfr.reject(error);
        } else {
          dfr.resolve(ref.name());
        }
      });

      return dfr.promise;
    }

    function _checkExistingProfile(id) {
      var dfr = $q.defer();
      var profiles = firebaseRef('profiles');
      
      profiles.child(id).once('value', function(snapshot){
        if (snapshot.val() !== null) {
          dfr.resolve(snapshot);
        } else {
          dfr.reject();
        }
      });

      return dfr.promise;
    }
  }
})();