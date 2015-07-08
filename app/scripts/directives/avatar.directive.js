(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('avatar', avatar);

  function avatar() {
    var _html = '<img ng-cloak ng-show="avatarId" class="animated fadeIn" ng-class="avatarStyle()" ng-src="{{avatarUrl()}}" />';

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

      $attrs.$observe('avatar', function(value){
        console.log(value);
        if(!value) { return false; }
        $scope.avatarId = value;
      });

      function avatarStyle() {
        return 'img-' + style;
      }

      function avatarUrl() {
        if(!$scope.avatarId) { return false; }

        return 'http://i.imgur.com/' + $scope.avatarId + size + '.jpg';
      }
    }
  }
})();