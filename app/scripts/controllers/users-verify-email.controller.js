(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('VerifyEmailController', VerifyEmailController);

  VerifyEmailController.$inject = ['$scope','profile', 'hash', '$location'];

  function VerifyEmailController($scope, profile, hash, $location) {
    function _updateEmailVerifiedHash() {
      if (!hash || !profile) {
        return _handleError('Missing profile and/or email verification hash. Please reload the page or try again. ');
      }

      if (profile && !profile.emailVerified) {
        profile.emailVerified = hash.$id;
        return profile.$save().then(_redirect, _handleError);
      } else {
        return _redirect();
      }
    }

    function _redirect() {
      $location.path('/signup/success');
    }

    function _handleError(error) {
      console.log(error);
      $scope.errors = error;
    }

    _updateEmailVerifiedHash();
  }
})();