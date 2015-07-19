(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersVerifyEmailController', UsersVerifyEmailController);

  UsersVerifyEmailController.$inject = ['$scope','hash', 'profile', '$location'];

  function UsersVerifyEmailController($scope, hash, profile, $location) {
    function _updateEmailVerifiedHash() {
      if (!hash || !profile) {
        console.debug('missing hash or profile');
        return false;
      }

      if (profile && !profile.emailVerified) {
        profile.emailVerified = angular.copy(hash.$id);
        profile.$save().then(_redirect, _handleError);
      } else {
        _redirect();
      }
    }

    function _redirect() {
      $location.path('/signup/success');
    }

    function _handleError(error) {
      console.log(error);
      $location.path('/my/account');
    }

    _updateEmailVerifiedHash();
  }
})();