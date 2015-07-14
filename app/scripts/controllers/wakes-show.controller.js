(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesShowController', WakesShowController);

  WakesShowController.$inject = ['$scope', 'wake', 'Users'];

  function WakesShowController($scope, wake, Users) {
    $scope.wake = wake;
    
    Users.getProfile(wake.userId).then(function(data){
        $scope.profile = data;
    });

    // $scope.wake = wake.$on('value', function(dataSnapshot){
    //   $scope.profile = Users.getProfile(dataSnapshot.snapshot.value.userId);
    // });

    // $scope.removeWake = function(wake){
    //   var modalInstance = $modal.open({
    //     templateUrl: '/views/wakes/removeModal.html',
    //     controller: 'DeleteWakeCtrl',
    //     size: 'sm',
    //     resolve: {
    //       wake: function () {
    //         return wake;
    //       }
    //     }
    //   });

    //   modalInstance.result.then(function(res){
    //     if(!res){
    //       $location.path('/wakes');
    //     }
    //   });
    // };
  }
})();