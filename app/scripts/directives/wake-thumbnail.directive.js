(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeThumbnail', wakeThumbnail);

  wakeThumbnail.$inject = ['Wakes'];

  function wakeThumbnail(Wakes) {
    var _html  = '<a class="thumbnail highlight" ng-href="/wakes/{{wake.id}}">';
        _html += '  <div class="wake-thumbnail pattern-pixelweave">';
        _html += '    <div class="shadow-overlay">';
        _html += '      <span>{{wake.boat.year}} {{wake.boat.make}} {{wake.boat.model}}</span>';
        _html += '    </div>';
        _html += '    <img avatar="{{wake.thumbnail}}" style="false" size="m" />';
        _html += '  </div>';
        _html += '  <div class="caption">';
        _html += '    <small class="muted"><i class="fa fa-map-marker"></i> {{wake.location.formatted}}</small>';
        _html += '    <span ng-cloak class="label pull-right" ng-show="wake.location.distance">{{wake.location.distance}} miles</span>';
        _html += '  </div>';
        _html += '</a>';
    
    var directive = {
      template: _html,
      controller: wakeThumbnailController
    };

    wakeThumbnailController.$inject = ['$scope', '$element', '$attrs'];

    return directive;

    function wakeThumbnailController($scope, $element, $attrs) {
      $attrs.$observe('wakeId', function(value){
        if (!value) { return false; }
        
        Wakes.get(value).then(function(data){
          $scope.wake = data;
        });
      });
    }
  }
})();