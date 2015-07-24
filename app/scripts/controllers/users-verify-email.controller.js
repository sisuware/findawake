(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersVerifyEmailController', UsersVerifyEmailController);

  UsersVerifyEmailController.$inject = ['$scope','hash', 'profile', '$location', '$timeout'];

  function UsersVerifyEmailController($scope, hash, profile, $location, $timeout) {
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
      //$timeout($location.path.bind('/signup/sucess'));
      window.location.replace(window.location.origin + '/signup/success');
    }

    function _handleError(error) {
      console.log(error);
      $location.path('/my/account');
    }

    _updateEmailVerifiedHash();
  }
})();