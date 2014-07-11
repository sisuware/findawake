'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.controller('LoginCtrl', function(
  $scope,
  SimpleLogin,
  Users,
  $location
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
    if( assertValidLoginAttempt() ) {
      SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
        $scope.loading = false;
        $scope.err = parseErrorMessages(err);
        if( !err && cb ) {
          cb(user);
        }
      });
    }
  };

  $scope.logout = SimpleLogin.logout;

  $scope.createAccount = function() {
    $scope.loading = true;
    $scope.err = null;
    if( assertValidCreateAccountAttempt() ) {
      SimpleLogin.createAccount($scope.email, $scope.pass, function(err) {
        $scope.loading = false;
        if( err ) {
          $scope.err = parseErrorMessages(err);
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

  function parseErrorMessages(err){
    if(err){
      return err.message.replace(/FirebaseSimpleLogin:\s/g,'');
    } else {
      return null;
    }
  }

  function assertValidLoginAttempt(){
    if( !$scope.email ) {
      $scope.err = 'Please enter an email address';
    } else if( !$scope.pass ) {
      $scope.err = 'Please enter a password';
    }
    return !$scope.err;
  }

  function assertValidCreateAccountAttempt() {
    if( !$scope.email ) {
      $scope.err = 'Please enter an email address';
    } else if( !$scope.pass ) {
      $scope.err = 'Please enter a password';
    } else if( $scope.pass !== $scope.confirm ) {
      $scope.err = 'Passwords do not match';
    }
    return !$scope.err;
  }
});