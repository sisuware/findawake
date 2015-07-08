(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeTypes', wakeTypes);

  wakeTypes.$inject = ['WakeSettings'];

  function wakeTypes(WakeSettings) {
    var _html  = '<div class="row">';
        _html += '  <div class="col-sm-4" ng-repeat="type in wakeTypes">';
        _html += '    <a href="" class="thumbnail board-thumbnail" ng-class="wake.types[type] ? \'active color3\':\'highlight\'" ng-click="wake.types[type] = !wake.types[type]">';
        _html += '      <span class="boarding-icons boarding-icons-{{type}}" ng-class="{true: type+\'-active\'}[wake.types[type]]"></span>';
        _html += '      <div class="caption text-center text-capitalize"><i class="fa" ng-class="wake.types[type] ? \'fa-check-square-o\':\'fa-square-o\'"></i> {{type}}</div>';
        _html += '    </a>';
        _html += '  </div>';
        _html += '</div>';

    //ng-class="{true: 'active color3'}[request.type[type.name].selected]" ng-click="request.type[type.name].selected = !request.type[type.name].selected

    var directive = {
      template: _html,
      controller: wakeTypesController,
      scope: {
        wake: '='
      }
    };

    wakeTypesController.$inject = ['$scope'];

    return directive;

    function wakeTypesController($scope) {
      $scope.wakeTypes = WakeSettings.wakeTypes();
    }
  }
})();