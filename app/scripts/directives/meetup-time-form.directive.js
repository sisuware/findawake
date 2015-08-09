(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('meetupTimeForm', meetupTimeForm);

  meetupTimeForm.$inject = ['$templateCache'];

  function meetupTimeForm($templateCache) {
    var _html  = '<timepicker ng-model="meetup.time"></timepicker>';

    var _timeHtml  = '<table class="white">';
        _timeHtml += '  <tbody>';
        _timeHtml += '    <tr class="text-center">';
        _timeHtml += '      <td><a ng-click="incrementHours()" class="btn btn-default btn-sm highlight"><i class="fa fa-chevron-up"></i></a></td>';
        _timeHtml += '      <td>&nbsp;</td>';
        _timeHtml += '      <td><a ng-click="incrementMinutes()" class="btn btn-default btn-sm highlight"><i class="fa fa-chevron-up"></i></a></td>';
        _timeHtml += '      <td ng-show="showMeridian"></td>';
        _timeHtml += '    </tr>';
        _timeHtml += '    <tr>';
        _timeHtml += '      <td class="form-group" ng-class="{\'has-error\': invalidHours}">';
        _timeHtml += '        <input style="width:50px;" type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">';
        _timeHtml += '      </td>';
        _timeHtml += '      <td>:</td>';
        _timeHtml += '      <td class="form-group" ng-class="{\'has-error\': invalidMinutes}">';
        _timeHtml += '        <input style="width:50px;" type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">';
        _timeHtml += '      </td>';
        _timeHtml += '      <td ng-show="showMeridian"><button type="button" class="btn btn-default btn-sm text-center highlight" ng-click="toggleMeridian()">{{meridian}}</button></td>';
        _timeHtml += '    </tr>';
        _timeHtml += '    <tr class="text-center">';
        _timeHtml += '      <td><a ng-click="decrementHours()" class="btn btn-default btn-sm highlight"><i class="fa fa-chevron-down"></i></a></td>';
        _timeHtml += '      <td>&nbsp;</td>';
        _timeHtml += '      <td><a ng-click="decrementMinutes()" class="btn btn-default btn-sm highlight"><i class="fa fa-chevron-down"></i></a></td>';
        _timeHtml += '      <td ng-show="showMeridian"></td>';
        _timeHtml += '    </tr>';
        _timeHtml += '  </tbody>';
        _timeHtml += '</table>';

    var directive = {
      template: _html,
      controller: meetupTimeFormController,
      scope: {
        meetup: '='
      }
    };  

    meetupTimeFormController.$inject = ['$scope'];

    return directive;

    function meetupTimeFormController($scope) {
      $scope.meetup.time = $scope.meetup.date;
      $templateCache.put('template/timepicker/timepicker.html', _timeHtml);
    }
  }
})();