(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('WakesIndexController', WakesIndexController);

  WakesIndexController.$inject = ['$scope','wake','auth','$modal','$location','Users'];

  function WakesIndexController($scope, wake, auth, $modal,$location, Users) {
    $scope.auth = auth;
    $scope.wake = wake;
    
    // $scope.wake = wake.$on('value', function(dataSnapshot){
    //   $scope.profile = Users.getProfile(dataSnapshot.snapshot.value.userId);
    // });

    $scope.requestRide = function(){
      if(_.isUndefined($scope.auth)){
        authModal();
      } else {
        requestRideModal();
      }
    };

    $scope.rideRequested = function(){
      if(_.isUndefined(auth) || _.isEmpty(auth)){ return false; }
      if(_.isObject(auth.requests)){
        return !_.isUndefined(auth.requests[wake.id]);
      }
      if(_.isArray(auth.requests)){
        return _.indexOf(auth.requests, wake.id) === -1;
      }
    };

    $scope.removeWake = function(wake){
      var modalInstance = $modal.open({
        templateUrl: '/views/wakes/removeModal.html',
        controller: 'DeleteWakeCtrl',
        size: 'sm',
        resolve: {
          wake: function () {
            return wake;
          }
        }
      });

      modalInstance.result.then(function(res){
        if(!res){
          $location.path('/wakes');
        }
      });
    };

    function authModal(){
      var modalInstance = $modal.open({
        templateUrl: '/views/loginModal.html',
        controller: 'LoginModalCtrl',
        size: 'md'
      });

      modalInstance.result.then(function(user){
        if(user){
          $scope.auth = Users.get(user.id);
          requestRideModal();
        }
      });
    }

    function requestRideModal(){
      var modalInstance = $modal.open({
        templateUrl: '/views/wakes/requestModal.html',
        controller: 'RequestCtrl',
        size: 'lg',
        resolve: {
          auth: function(){
            return $scope.auth;
          },
          wake: function(){
            return $scope.wake;
          }
        }
      });

      modalInstance.result.then(function(){

      });
    }
  }
})();