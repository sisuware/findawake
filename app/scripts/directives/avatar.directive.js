(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('avatar', avatar);

  function avatar() {
    var _html = '<img ng-cloak ng-show="profile.avatar" class="animated fadeIn" ng-class="avatarStyle()" ng-src="{{avatarUrl(profile.avatar)}}" />';

    var directive = {
      template: _html,
      link: avatarController
    };

    return directive;

    function avatarController($scope, $element, $attrs) {
      var size = $attrs.size || 's';
      var style = $attrs.style || 'circle';

      $scope.avatarUrl = avatarUrl;
      $scope.avatarStyle = avatarStyle;

      function avatarStyle() {
        return 'img-' + style;
      }

      function avatarUrl(id) {
        if(!id) { return false; }

        return 'http://i.imgur.com/' + id + size + '.jpg';
      }
    }
  }
})();