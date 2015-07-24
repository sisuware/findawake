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
      $timeout(function(){
        $location.path('/signup/success');
        $scope.$destroy();
      });
    }

    function _handleError(error) {
      console.log(error);
      $location.path('/account/edit');
    }

    $timeout(_updateEmailVerifiedHash);
  }
})();