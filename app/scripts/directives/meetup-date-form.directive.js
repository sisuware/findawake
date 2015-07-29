(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('meetupDateForm', meetupDateForm);

  meetupDateForm.$inject = ['$templateCache'];

  function meetupDateForm($templateCache) {
    /* jshint maxstatements:48 */
    var _html = '<datepicker class="pull-left" ng-model="meetup.date" min-date="minDate" show-weeks="false"></datepicker>';
    
    var _monthHtml  = '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}" class="white">';
        _monthHtml += '  <thead>';
        _monthHtml += '    <tr>';
        _monthHtml += '      <th><button type="button" class="btn btn-default btn-sm pull-left highlight" ng-click="move(-1)" tabindex="-1"><i class="fa fa-chevron-left"></i></button></th>';
        _monthHtml += '      <th>';
        _monthHtml += '        <button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm highlight"'; 
        _monthHtml += '           ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button>';
        _monthHtml += '      </th>';
        _monthHtml += '      <th><button type="button" class="btn btn-default btn-sm pull-right highlight" ng-click="move(1)" tabindex="-1"><i class="fa fa-chevron-right"></i></button></th>';
        _monthHtml += '    </tr>';
        _monthHtml += '  </thead>';
        _monthHtml += '  <tbody>';
        _monthHtml += '    <tr ng-repeat="row in rows track by $index">';
        _monthHtml += '      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{::dt.uid}}" ng-class="::dt.customClass">';
        _monthHtml += '        <button type="button" style="width:100%;" class="btn btn-default highlight" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)"'; 
        _monthHtml += '           ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>';
        _monthHtml += '      </td>';
        _monthHtml += '    </tr>';
        _monthHtml += '  </tbody>';
        _monthHtml += '</table>';

    var _dayHtml  = '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}" class="white">';
        _dayHtml += '  <thead>';
        _dayHtml += '    <tr>';
        _dayHtml += '      <th><button type="button" class="btn btn-default btn-sm pull-left highlight" ng-click="move(-1)" tabindex="-1"><i class="fa fa-chevron-left"></i></button></th>';
        _dayHtml += '      <th colspan="{{::5 + showWeeks}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm highlight"'; 
        _dayHtml += '        ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>';
        _dayHtml += '      <th><button type="button" class="btn btn-default btn-sm pull-right highlight" ng-click="move(1)" tabindex="-1"><i class="fa fa-chevron-right"></i></button></th>';
        _dayHtml += '    </tr>';
        _dayHtml += '    <tr>';
        _dayHtml += '      <th ng-if="showWeeks" class="text-center"></th>';
        _dayHtml += '      <th ng-repeat="label in ::labels track by $index" class="text-center"><small aria-label="{{::label.full}}">{{::label.abbr}}</small></th>';
        _dayHtml += '    </tr>';
        _dayHtml += '  </thead>';
        _dayHtml += '  <tbody>';
        _dayHtml += '    <tr ng-repeat="row in rows track by $index">';
        _dayHtml += '      <td ng-if="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>';
        _dayHtml += '      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{::dt.uid}}" ng-class="::dt.customClass">';
        _dayHtml += '        <button type="button" style="width:100%;" class="btn btn-default btn-sm highlight" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)"'; 
        _dayHtml += '           ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{::dt.label}}</span></button>';
        _dayHtml += '      </td>';
        _dayHtml += '    </tr>';
        _dayHtml += '  </tbody>';
        _dayHtml += '</table>';

    var directive = {
      template: _html,
      controller: meetupDatetimeFormController,
      scope: {
        meetup: '='
      }
    };  

    meetupDatetimeFormController.$inject = ['$scope'];

    return directive;

    function meetupDatetimeFormController($scope) {
      $scope.minDate = Date.now();
      $scope.meetup.date = Date.now();

      $templateCache.put('template/datepicker/month.html', _monthHtml);
      $templateCache.put('template/datepicker/day.html', _dayHtml);
    }
  }
})();