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
  $location
){
  $scope.login = function(service) {
    SimpleLogin.login(service, function(err) {
      $scope.err = err? err + '' : null;
    });
  };

  $scope.loginPassword = function(cb) {
    $scope.err = null;
    if( !$scope.email ) {
      $scope.err = 'Please enter an email address';
    }
    else if( !$scope.pass ) {
      $scope.err = 'Please enter a password';
    }
    else {
      SimpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
        $scope.err = err? err + '' : null;
        if( !err && cb ) {
          cb(user);
        }
      });
    }
  };

  $scope.logout = SimpleLogin.logout;

  $scope.createAccount = function() {
    function assertValidLoginAttempt() {
      if( !$scope.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( $scope.pass !== $scope.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    $scope.err = null;
    if( assertValidLoginAttempt() ) {
      SimpleLogin.createAccount($scope.email, $scope.pass, function(err, user) {
        if( err ) {
          $scope.err = err? err + '' : null;
        } else {
          // must be logged in before I can write to my profile
          $scope.login(function() {
            SimpleLogin.createProfile(user.uid, user.email);
            $location.path('/account');
          });
        }
      });
    }
  };
});