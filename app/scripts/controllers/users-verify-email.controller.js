(function(){
  'use strict';

  angular
    .module('findAWake')
    .controller('UsersVerifyEmailController', UsersVerifyEmailController);

  UsersVerifyEmailController.$inject = ['$scope','Hashes', 'profile', '$location'];

  function UsersVerifyEmailController($scope, Hashes, profile, $location) {
    Hashes.get($location.search('hash')).then(_updateEmailVerifiedHash, _handleError);

    function _updateEmailVerifiedHash(hash) {
      if (!hash || !profile) {
        return _handleError('missing hash or profile');
      }

      if (hash.$value !== profile.$id) {
        return _handleError('hash id mismatch');
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
      $location.path('/account/edit');
      _cleanup();
    }

    function _cleanup() {
      $location.search('');
      $scope.$destroy(); 
    }
  }
})();