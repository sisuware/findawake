'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findAWake');

app.controller('UsersEditController', function(
  $scope, 
  $timeout,
  UserSettings, 
  Users,
  Imgur,
  profile
){
  $scope.profile = profile;
  //UserSettings.init($scope);



  $scope.changeAvatar = function(){
    $scope.existingAvatar = angular.copy($scope.profile.avatar);
    $scope.profile.avatar = false;
  };

  $scope.cancelChangeAvatar = function(){
    $scope.profile.avatar = $scope.existingAvatar;
    $scope.existingAvatar = false;
  }; 

  $scope.uploadAvatar = function(){
    $scope.uploadingAvatar = true;
    Imgur.upload($scope.avatar).then(function(res){
      $scope.profile.avatar = res.data.link;
    }, function(res){
      $scope.errors = res;
    }).finally(function(){
      $scope.uploadingAvatar = false;
    });
  };

  $scope.updateProfile = function(){
    $scope.savingProfile = true;
    $scope.profileSaved = false;
    
    $scope.profile.$save().then(function(){
      Users.updatePublicProfile($scope.profile);
    }).finally(function(){
      $timeout(function(){
        $scope.savingProfile = false;
        $scope.profileSaved = true;
        resetUpdateState();
      },150);
    });
  };

  function resetUpdateState(){
    $timeout(function(){
      $scope.profileSaved = false;
    }, 500);
  }
});

app.controller('UserWelcomeCtrl', function(
  $scope,
  profile
){
  $scope.profile = profile;
});