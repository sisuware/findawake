(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('profileAvatar', profileAvatar);

  profileAvatar.$inject = ['Imgur', 'Users'];
  
  function profileAvatar(Imgur, Users) {
    var _html =  '<div class="row">';
        _html += '  <div class="col-sm-12"><h4>Avatar</h4></div>';
        _html += '</div>';
        _html += '<div class="row form-group">';
        _html += '  <div ng-cloak ng-show="errors" class="alert alert-danger"><strong>{{errors}}</strong></div>';
        _html += '  <div class="col-sm-4">';
        _html += '    <img avatar="{{profile.avatar}}" size="m" style="rounded" />';
        _html += '    <div ng-cloak ng-hide="profile.avatar" class="btn-lg img-thumbnail">';
        _html += '      <i ng-hide="uploadingAvatar" class="fa fa-user"></i>';
        _html += '      <i ng-cloak ng-show="uploadingAvatar" class="fa fa-spinner fa-spin"></i>';
        _html += '    </div>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-show="profile.avatar && !existingAvatar" class="col-sm-8 text-right">';
        _html += '    <button type="button" class="btn btn-sm btn-danger" ng-click="deleteAvatar()"><i class="fa fa-trash-o"></i></button>';
        _html += '    <button type="button" class="btn btn-sm btn-info" ng-click="changeAvatar()">Change</button>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-hide="profile.avatar && !existingAvatar" class="col-sm-8" ng-form="avatarForm">';
        _html += '    <div class="form-group input-group">';
        _html += '      <input type="file" class="form-control input-sm" file-upload="avatar" required name="avatar"/>';
        _html += '      <span class="input-group-btn">';
        _html += '        <button class="btn btn-sm btn-success" ng-disabled="!avatar || uploadingAvatar" ng-click="uploadAvatar()" ng-bind="uploadingAvatar ? \'Uploading...\':\'Upload\'"></button>';
        _html += '      </span>';
        _html += '    </div>';
        _html += '    <button ng-cloak ng-show="existingAvatar" type="button" class="btn btn-sm btn-warning" disabled="uploadingAvatar" ng-click="cancelChangeAvatar()">Cancel</button>';
        _html += '  </div>';
        _html += '</div>';

    var directive = {
      template: _html,
      scope: {
        profile: '='
      },
      controller: profileAvatarController
    };

    profileAvatarController.$inject = ['$scope', '$element', '$attrs'];

    return directive;

    function profileAvatarController($scope, $element, $attrs) {
      $scope.uploadAvatar = uploadAvatar;
      $scope.changeAvatar = changeAvatar;
      $scope.cancelChangeAvatar = cancelChangeAvatar;
      $scope.deleteAvatar = deleteAvatar;

      function deleteAvatar() {
        delete $scope.profile.avatar;
        updateProfile();
      }

      function changeAvatar(){
        $scope.existingAvatar = angular.copy($scope.profile.avatar);
      }

      function cancelChangeAvatar(){
        $scope.profile.avatar = $scope.existingAvatar;
        $scope.existingAvatar = false;
      }
      
      function uploadAvatar(){
        $scope.uploadingAvatar = true;
        $scope.errors = false;

        Imgur.upload($scope.avatar).then(function(res){
          $scope.profile.avatar = res.data.id;
          updateProfile();
        }, function(res){
          $scope.errors = res;
        }).finally(function(){
          $scope.uploadingAvatar = false;
          $scope.existingAvatar = false;
        });
      }

      function updateProfile(){
        $scope.profile.$save().then(function(){
          Users.updatePublicProfile($scope.profile);  
        });
      }
    }
  }
})();