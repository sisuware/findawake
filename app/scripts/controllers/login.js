'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findAWake');

app.controller('LoginCtrl', function(
  $scope,
  SimpleLogin,
  Users,
  $location,
  $window
){
  $scope.login = function(service) {
    $scope.loading = true;
    SimpleLogin.login(service, function(err) {
      $scope.loading = false;
      $scope.err = err? err + '' : null;
    });
  };

  $scope.loginPassword = function(cb) {
    $scope.loading = true;
    $scope.err = null;
    var invalidLogin = SimpleLogin.assertValidLoginAttempt($scope.email, $scope.pass);
    if(invalidLogin) {
      $scope.loading = false;
      $scope.err = invalidLogin;
    } else {
      SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
        $scope.loading = false;
        $scope.err = SimpleLogin.parseErrorMessages(err);
        if( !err && cb ) {
          cb(user);
        }
      });
    }
  };

  $scope.logout = function(){
    SimpleLogin.logout();
    $window.location.reload();
  };

  $scope.createAccount = function() {
    $scope.loading = true;
    $scope.err = null;
    var invalidLogin = SimpleLogin.assertValidCreateAccountAttempt($scope.email, $scope.pass, $scope.confirm);
    if(invalidLogin) {
      $scope.err = invalidLogin;
    } else {
      SimpleLogin.createAccount($scope.email, $scope.pass, function(err) {
        $scope.loading = false;
        if( err ) {
          $scope.loading = false;
          $scope.err = SimpleLogin.parseErrorMessages(err);
        } else {
          $scope.creatingProfile = true;
          // must be logged in before I can write to my profile
          SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
            if(err){ 
              $scope.creatingProfile = false;
              $scope.err = err;
            } else {
              SimpleLogin.createProfile(user.id, user.email).then(function(user) {
                Users.createPublicProfile(user).then(function(){
                  $location.path('/welcome');
                });
              });
            }
          });
        }
      });
    }
  };
});

app.controller('LoginModalCtrl', function(
  $scope,
  SimpleLogin,
  Users,
  $location,
  $modalInstance
){
  $scope.cancel = function(){
    $modalInstance.dismiss();
  };

  $scope.loginPassword = function(cb) {
    $scope.loading = true;
    $scope.err = null;
    var invalidLogin = SimpleLogin.assertValidLoginAttempt($scope.email, $scope.pass);
    if(invalidLogin) {
      $scope.loading = false;
      $scope.err = invalidLogin;
    } else {
      SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
        $scope.loading = false;
        $scope.err = SimpleLogin.parseErrorMessages(err);
        if( !err && cb ) {
          cb(user);
        }
        if(!err){
          $modalInstance.close(user);
        }
      });
    }
  };

  $scope.createAccount = function() {
    $scope.loading = true;
    $scope.err = null;
    var invalidLogin = SimpleLogin.assertValidCreateAccountAttempt($scope.email, $scope.pass, $scope.confirm);
    if(invalidLogin) {
      $scope.loading = false;
      $scope.err = invalidLogin;
    } else {
      SimpleLogin.createAccount($scope.email, $scope.pass, function(err) {
        $scope.loading = false;
        if( err ) {
          $scope.err = SimpleLogin.parseErrorMessages(err);
        } else {
          $scope.creatingProfile = true;
          // must be logged in before I can write to my profile
          SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
            if(err){ 
              $scope.creatingProfile = false;
              $scope.err = err;
            } else {
              SimpleLogin.createProfile(user.id, user.email).then(function(user) {
                Users.createPublicProfile(user).then(function(){
                 $modalInstance.resolve();
                });
              });
            }
          });
        }
      });
    }
  };
});