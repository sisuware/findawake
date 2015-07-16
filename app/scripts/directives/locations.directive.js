(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('locations', locations);

  locations.$inject = ['Locations'];

  function locations(Locations) {
    var _html  = '<div class="row clearfix">';
        _html += '  <div ng-repeat="location in locations" class="col-md-3 col-sm-4 col-xs-12">';
        _html += '    <h3 class="text-serif">{{location.$id}}</h3>';
        _html += '    <ul class="list-unstyled">';
        _html += '      <li ng-repeat="(key,value) in location"><a ng-href="/wakes/in/{{location.$id}}/{{key}}"><span class="badge">{{locationTotal(value)}}</span> {{key}}</a></li>';
        _html += '    </ul>';
        _html += '  </div>';
        _html += '</div>';
    
    var directive = {
      template: _html,
      controller: locationsController
    };

    locationsController.$inject = ['$scope'];

    return directive;

    function locationsController($scope) {
      Locations.query().then(function(data){
        $scope.locations = data;
      });

      $scope.locationTotal = locationTotal;

      function locationTotal(data) {
        return _.values(data).length;
      }
    }
  }
})();