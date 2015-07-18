(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersVerifyEmailController', UsersVerifyEmailController);

  UsersVerifyEmailController.$inject = ['$scope','hash', 'profile', '$location'];

  function UsersVerifyEmailController($scope, hash, profile, $location) {
    $scope.hash = hash;
    $scope.profile = profile;

    $scope.profile.emailVerified = hash.$id;
    
    $scope.profile.$save().then(function(){
      $location.path('/signup/success');
    }, function(errors){
      $scope.errors = errors;
    });
  }
})();