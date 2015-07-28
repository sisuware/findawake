(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersVerifyEmailController', UsersVerifyEmailController);

  UsersVerifyEmailController.$inject = ['$scope','Hashes', 'profile', '$location'];

  function UsersVerifyEmailController($scope, Hashes, profile, $location) {
    var searchParam = $location.search();
    
    if (searchParam && searchParam.hash) {
      Hashes.get(searchParam.hash).then(_updateEmailVerifiedHash, _handleError);
    } else {
      _handleError('Invalid email verification');
    }

    function _updateEmailVerifiedHash(hash) {
      if (!hash || !profile) {
        return _handleError('Unable to find a valid profile or the email verification is invalid');
      }

      if (hash.$value !== profile.$id) {
        return _handleError('Invalid! Please verify you are clicking on the verify email link in the email');
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
      _cleanup();
    }

    function _handleError(error) {
      console.log(error);
      $scope.errors = error;
      _cleanup();
    }

    function _cleanup() {
      $location.search('');
    }
  }
})();