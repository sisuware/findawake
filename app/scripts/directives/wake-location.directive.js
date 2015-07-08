(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeLocation', wakeLocation);

  wakeLocation.$inject = ['LocationGeocode'];

  function wakeLocation(LocationGeocode) {
    var _html  = '<div class="form-group" ng-cloak ng-show="wake.location">';
      // _html += '  <div class="well well-sm">';
      _html += '    <div class="row clearfix">';
      _html += '      <div class="col-xs-6">';
      _html += '        <h5><i class="fa fa-map-marker"></i> {{wake.location.formatted}} <span class="label label-success">Verified</span></h5>';
      _html += '      </div>';
      _html += '      <div class="col-xs-6 text-right">';
      _html += '        <button class="btn btn-sm btn-danger" ng-click="removeLocation()"><i class="fa fa-trash-o"></i></button>';
      _html += '      </div>';
      _html += '    </div>';
      // _html += '  </div>';
      _html += '</div>';
      _html += '<div class="form-group" ng-hide="wake.location">';
      _html += '  <div class="row">';
      _html += '    <div class="col-xs-4" ng-class="{\'has-success\':location.city,\'has-error\':!location.city}">';
      _html += '      <input type="text" class="form-control" Placeholder="City" ng-model="location.city" ng-model-options="modelOptions" ng-change="validateLocation()" required/>';
      _html += '    </div>';
      _html += '    <div class="col-xs-2" ng-class="{\'has-success\':location.state,\'has-error\':!location.state}">';
      _html += '      <input type="text" class="form-control" Placeholder="State" ng-model="location.state" ng-model-options="modelOptions" ng-change="validateLocation()" required/>';
      _html += '    </div>';
      _html += '    <div class="col-xs-3" ng-class="{\'has-success\':location.zipcode}">';
      _html += '      <input type="text" class="form-control" Placeholder="Zipcode" ng-model="location.zipcode" ng-model-options="modelOptions" ng-change="validateLocation()"/>';
      _html += '    </div>';
      _html += '    <div class="col-xs-3" ng-class="{\'has-success\':location.country}">';
      _html += '      <input type="text" class="form-control" Placeholder="Country" ng-model="location.country" ng-model-options="modelOptions" ng-change="validateLocation()"/>';
      _html += '    </div>';
      _html += '  </div>';
      _html += '</div>';
      _html += '<div ng-cloak ng-show="errors" class="alert alert-danger">{{errors}}</div>'
      _html += '<div ng-cloak class="text-center" ng-show="validating">';
      _html += '  <small class="muted"><i class="fa fa-spin fa-spinner"></i> Verifying the location...</small>';
      _html += '</div>';
      _html += '<div class="form-group" ng-show="validatedLocations">';
      _html += '  <b>Please select a verified location:</b>';
      _html += '  <div class="radio" ng-repeat="location in validatedLocations">';
      _html += '    <label>';
      _html += '      <input type="radio" name="validatedLocations" ng-value="location" ng-model="wake.location">';
      _html += '      {{location.formatted}}';
      _html += '    </label>';
      _html += '  </div>';
      _html += '</div>';

    var directive = {
      template: _html,
      controller: wakeLocationController,
      scope: {
        wake: '='
      }
    };

    wakeLocationController.$inject = ['$scope','$element','$attrs'];

    return directive;

    function wakeLocationController($scope, $element, $attrs) {
      $scope.modelOptions = {
        debounce: 500
      };

      $scope.validateLocation = validateLocation;
      $scope.removeLocation = removeLocation;

      function removeLocation() {
        delete $scope.wake.location;
      }

      function validateLocation() {
        $scope.validating = true;
        $scope.errors = false;
        
        LocationGeocode.validate($scope.location).then(function(res){
          $scope.validatedLocations = res;
        }, function(res){
          $scope.errors = res;
        }).finally(function(){
          $scope.validating = false;
        });
      }
    }
  }
})();