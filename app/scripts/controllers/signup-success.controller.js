(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('SignupSuccessController', SignupSuccessController);

  SignupSuccessController.$inject = ['$scope', 'profile', '$location'];

  function SignupSuccessController($scope, profile, $location) {
    $scope.profile = profile;
  }
})();