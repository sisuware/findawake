(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesShowController', WakesShowController);

  WakesShowController.$inject = ['$scope', 'wake', 'Users'];

  function WakesShowController($scope, wake, Users) {
    $scope.wake = wake;
    
    function _loadProfile() {
      if (!wake || wake && !wake.userId) { return false; }
      Users.getProfile(wake.userId).then(function(data){
        $scope.profile = data;
      });
    }
    
    _loadProfile();
  }
})();