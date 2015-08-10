(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('MeetupsNewController', MeetupsNewController);

  MeetupsNewController.$inject = ['$scope', 'auth', 'wake', 'Meetups', '$location'];

  function MeetupsNewController($scope, auth, wake, Meetups, $location) {
    $scope.wake = wake;
    $scope.auth = auth;
    $scope.submit = submit;

    function submit() {
      $scope.errors = false;
      $scope.processing = true;

      Meetups.create($scope.meetup).then(function(ref){
        $location.path('/meetups/' + wake.id);
      }, function(errors){
        $scope.errors = errors;
      }).finally(function(){
        $scope.processing = false;
      });
    }

    function _defaultValues() {
      $scope.meetup = {};
      $scope.meetup.wakeId = wake.id;
      $scope.meetup.userId = auth.uid;
    }

    _defaultValues();
  }
})();