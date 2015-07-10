(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('avatar', avatar);

  function avatar() {
    var directive = {
      link: avatarController,
      restrict: 'AE'
    };

    return directive;

    /**
      * Size:
      * s Small Square  90x90
      * b Big Square  160x160
      * t Small Thumbnail 160x160 (Keeps image proportions)
      * m Medium Thumbnail  320x320 (Keeps image proportions)
      * l Large Thumbnail 640x640 (Keeps image proportions)
      * h Huge Thumbnail  1024x1024 (Keeps image proportions)
      */
    function avatarController($scope, $element, $attrs) {
      var size = $attrs.size || 's';
      var style = $attrs.style || 'circle';

      $attrs.$observe('avatar', function(value){
        if(!value) { return false; }
        $attrs.$set('src', _imgurUrl(value));
      });

      if (style && style !== 'false') {
        $attrs.$addClass(_thumbnailStyle());
      }

      function _thumbnailStyle() {
        return 'img-' + style;
      }

      function _imgurUrl(value) {
        return 'http://i.imgur.com/' + value + size + '.jpg';
      }
    }
  }
})();