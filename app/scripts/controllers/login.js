(function(){
  'use strict';

  angular
   .module('findAWake')
   .controller('LoginController', LoginController);

   LoginController.$inject = ['$scope', 'SimpleLogin', 'Users', '$location', '$window'];

  function LoginController($scope, SimpleLogin, Users, $location, $window){
    $scope.redirect = $location.search().redirect || false;
    $scope.login = login;
    $scope.loginPassword = loginPassword;


    function login(service) {
      _reset();
      $scope.loading = true;
      
      SimpleLogin.login(service).then(_handleSuccess, _handleError);
    }

    function _handleSuccess() {
      console.debug('you are now logged in.');
      if ($scope.redirect) {
        $location.path($scope.redirect).search('');
      } else {
        $lcoation.path('/');
      }
    }

    function _handleError(error) {
      $scope.loading = false;
      $scope.error = error;
    }

    function _reset() {
      $scope.error = false;
    }

    function loginPassword(cb) {
      _reset();
      $scope.loading = true;

      var invalidLogin = SimpleLogin.assertValidLoginAttempt($scope.email, $scope.pass);

      if(invalidLogin) {
        $scope.loading = false;
        $scope.error = invalidLogin;
        return false;
      }

      SimpleLogin.loginPassword($scope.email, $scope.pass).then(_handleSuccess, _handleError);
    }
  }

  // app.controller('LoginModalCtrl', function(
  //   $scope,
  //   SimpleLogin,
  //   Users,
  //   $location,
  //   $modalInstance
  // ){
  //   $scope.cancel = function(){
  //     $modalInstance.dismiss();
  //   };

  //   $scope.loginPassword = function(cb) {
  //     $scope.loading = true;
  //     $scope.err = null;
  //     var invalidLogin = SimpleLogin.assertValidLoginAttempt($scope.email, $scope.pass);
  //     if(invalidLogin) {
  //       $scope.loading = false;
  //       $scope.err = invalidLogin;
  //     } else {
  //       SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
  //         $scope.loading = false;
  //         $scope.err = SimpleLogin.parseErrorMessages(err);
  //         if( !err && cb ) {
  //           cb(user);
  //         }
  //         if(!err){
  //           $modalInstance.close(user);
  //         }
  //       });
  //     }
  //   };

  //   $scope.createAccount = function() {
  //     $scope.loading = true;
  //     $scope.err = null;
  //     var invalidLogin = SimpleLogin.assertValidCreateAccountAttempt($scope.email, $scope.pass, $scope.confirm);
  //     if(invalidLogin) {
  //       $scope.loading = false;
  //       $scope.err = invalidLogin;
  //     } else {
  //       SimpleLogin.createAccount($scope.email, $scope.pass, function(err) {
  //         $scope.loading = false;
  //         if( err ) {
  //           $scope.err = SimpleLogin.parseErrorMessages(err);
  //         } else {
  //           $scope.creatingProfile = true;
  //           // must be logged in before I can write to my profile
  //           SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
  //             if(err){ 
  //               $scope.creatingProfile = false;
  //               $scope.err = err;
  //             } else {
  //               SimpleLogin.createProfile(user.id, user.email).then(function(user) {
  //                 Users.createPublicProfile(user).then(function(){
  //                  $modalInstance.resolve();
  //                 });
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   };
  // });
})();