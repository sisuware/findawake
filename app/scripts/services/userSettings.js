(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('UserSettings', UserSettings);

  UserSettings.$inject = [];

  function UserSettings() {
    var _gearKeys = ['Wakeboard','Wakesurf','Wakeskate','Helmet','Bindings','Camera','Handle','Rope','Fins','Shoes','Vest'];

    var service = {
      gear: listGearTypes
    };

    return service;

    function init($scope) {
      assertProfile($scope.profile);

      if(_.isUndefined($scope.profile.gear)) {
        $scope.profile.gear = [];
      }

      $scope.gearTypes = listGearTypes();
    }

    function listGearTypes(){
      return _gearKeys;
    }

    function assertProfile(profile){
      if(_.isUndefined(profile) || _.isNull(profile)) { throw new Error('Profile must be loaded before calling UserSettings'); }
      
      // these are required and never should be empty, but in case the profile was deleted this will re-create it.
      //if(_.isUndefined(profile.email) && _.isUndefined(profile.id) && _.isUndefined(profile.name)) {
        //SimpleLogin.currentUser().then(function(user){
        //  SimpleLogin.createProfile(user.id, user.email);
        //});
      //}
    }
  }
})();