(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('meetupLocationForm', meetupLocationForm);

  meetupLocationForm.$inject = ['LocationGeocode'];

  function meetupLocationForm(LocationGeocode) {
    /* jshint maxstatements:43 */
    var _html  = '<div class="form-group" ng-cloak ng-show="meetup.location">';
        _html += '  <div class="alert alert-info">';
        _html += '    <div class="row clearfix">';
        _html += '      <div class="col-xs-11">';
        _html += '        <i class="fa fa-map-marker"></i> {{meetup.location.formatted}} <span class="label label-success">Verified</span>';
        _html += '      </div>';
        _html += '      <div class="col-xs-1 text-right">';
        _html += '        <button class="btn btn-xs btn-danger" ng-click="removeLocation()"><i class="fa fa-trash-o"></i></button>';
        _html += '      </div>';
        _html += '    </div>';
        _html += '  </div>';
        _html += '</div>';
        _html += '<div class="form-group" ng-hide="meetup.location">';
        _html += '  <div class="row">';
        _html += '    <div class="col-xs-12" ng-class="{\'has-success\':location,\'has-error\':!location}">';
        _html += '      <input type="text" class="form-control" Placeholder="Meetup Location" ng-model="location" ng-model-options="modelOptions" ng-change="validateLocation()" required/>';
        _html += '    </div>';
        _html += '  </div>';
        _html += '</div>';
        _html += '<div ng-cloak ng-show="errors" class="alert alert-danger">{{errors}}</div>';
        _html += '<div ng-cloak class="text-center" ng-show="validating">';
        _html += '  <small class="muted"><i class="fa fa-spin fa-spinner"></i> Verifying the location...</small>';
        _html += '</div>';
        _html += '<div class="form-group" ng-show="validatedLocations">';
        _html += '  <b>Please select a verified location:</b>';
        _html += '  <div class="radio" ng-repeat="location in validatedLocations">';
        _html += '    <label>';
        _html += '      <input type="radio" name="validatedLocations" ng-value="location" ng-model="meetup.location">';
        _html += '      {{location.formatted}}';
        _html += '    </label>';
        _html += '  </div>';
        _html += '</div>';

    var directive = {
      template: _html,
      controller: wakeLocationController,
      scope: {
        meetup: '='
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
        delete $scope.meetup.location;
      }

      function validateLocation() {
        $scope.validating = true;
        $scope.errors = false;
        
        LocationGeocode.validate($scope.location, true).then(function(res){
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