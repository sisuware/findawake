(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Users', Users);

  Users.$inject = ['syncData', 'firebaseRef', '$q', 'FirebaseModels'];

  function Users(syncData, firebaseRef, $q, FirebaseModels) {
    var profiles = {};

    var service = {
      get: get,
      getProfile: getProfile,
      updateProfile: updateProfile
    };

    return service; 
    
    function get(id){
      if (!id) { return false; }
      return syncData.object('users/' + id).$loaded();
    }

    function getProfile(id){
      if(!id){ return false; }
      if(!profiles[id]){
        profiles[id] = syncData.object('profiles/' + id).$loaded();
      }
      return profiles[id];
    }

    function updateProfile(profile) {
      return profile.$save().then(function(){
        FirebaseModels.createTask({'task':'profile','userId':profile.userId});
      });
    }
  }
})();