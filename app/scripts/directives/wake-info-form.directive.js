(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeInfoForm', wakeInfoForm);

  wakeInfoForm.$inject = ['WakeSettings'];

  function wakeInfoForm(WakeSettings) {
    var _html  = '<div class="row">';
        _html += '  <div class="col-sm-3 form-group" ng-class="inputFeedback(wake.boat.year)">';
        _html += '    <select class="form-control" ng-model="wake.boat.year" name="boat.year" ng-options="year as year for year in years" required>';
        _html += '      <option value="" disabled selected>Select a Year</option>';
        _html += '    </select>';
        _html += '  </div>';
        _html += '  <div class="col-sm-4 form-group" ng-class="inputFeedback(wake.boat.make)">';
        _html += '    <input type="text" class="form-control" name="boat.make" Placeholder="Make" ng-model="wake.boat.make" required/>';
        _html += '  </div>';
        _html += '  <div class="col-sm-5 form-group" ng-class="inputFeedback(wake.boat.model)">';
        _html += '    <input type="text" class="form-control" name="boat.model" Placeholder="Model" ng-model="wake.boat.model" required/>';
        _html += '  </div>';
        _html += '  <div class="col-sm-12 form-group" ng-class="inputFeedback(wake.boat.model)">';
        _html += '    <textarea class="form-control" Placeholder="Describe your badass boat setup; wake size, overloaded ballasts, loud stereo, etc..." ng-model="wake.boat.description"></textarea>';
        _html += '  </div>';
        _html += '</div>';

    var directive = {
      template: _html,
      controller: wakeInfoController,
      scope: {
        wake: '='
      }
    };

    wakeInfoController.$inject = ['$scope'];

    return directive;

    function wakeInfoController($scope) {
      $scope.years = WakeSettings.years();
      $scope.inputFeedback = inputFeedback;

      function inputFeedback(model) {
        return model ? 'has-success' : 'has-error';
      }
    }
  }
})();