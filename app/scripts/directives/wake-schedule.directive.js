(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeSchedule', wakeSchedule);

  wakeSchedule.$inject = ['WakeSettings'];

  function wakeSchedule(WakeSettings) {
    var _html  = '<table class="table table-condensed table-striped highlight">';
        _html += '  <thead>';
        _html += '    <tr>';
        _html += '      <th>Day</th>';
        _html += '      <th>From</th>';
        _html += '      <th>To</th>';
        _html += '      <th></th>';
        _html += '    </tr>';
        _html += '  </thead>';
        _html += '  <tbody>';
        _html += '    <tr ng-repeat="schedule in wake.schedules">';
        _html += '      <td>{{schedule.day}}</td>';
        _html += '      <td>{{schedule.from.hour}}{{schedule.from.period}}</td>';
        _html += '      <td>{{schedule.to.hour}}{{schedule.to.period}}</td>';
        _html += '      <td><button class="btn btn-sm btn-danger" ng-click="removeSchedule($index)"><i class="fa fa-trash-o"></i></button></td>';
        _html += '    </tr>';
        _html += '    <tr class="info" ng-form="scheduleForm">';
        _html += '      <td class="col-sm-4">';
        _html += '        <select class="form-control input-sm" ng-model="schedule.day" name="day" ng-options="day as day for day in days" required></select>';
        _html += '      </td>';
        _html += '      <td class="col-sm-4 form-inline">';
        _html += '        <select class="form-control input-sm" ng-model="schedule.from.hour" name="fromHour" ng-options="hour as hour for hour in hours" required></select>';
        _html += '        <select class="form-control input-sm" ng-model="schedule.from.period" name="fromPeriod" ng-options="period as period for period in timePeriods" required></select>';
        _html += '      </td>';
        _html += '      <td class="col-sm-4 form-inline">';
        _html += '        <select class="form-control input-sm" ng-model="schedule.to.hour" name="toHour" ng-options="hour as hour for hour in hours" required></select>';
        _html += '        <select class="form-control input-sm" ng-model="schedule.to.period" name="toPeriod" ng-options="period as period for period in timePeriods" required></select>';
        _html += '      </td>';
        _html += '      <td><button type="submit" class="btn btn-success btn-sm" ng-click="addSchedule(schedule)" ng-disabled="scheduleForm.$invalid"><i class="fa fa-plus"></i></td>';
        _html += '    </tr>';
        _html += '  </tbody>';
        _html += '</table>';

    var directive = {
      controller: wakeScheduleController,
      template: _html,
      scope: {
        wake: '='
      }
    };

    wakeScheduleController.$inject = ['$scope','$element','$attrs'];

    return directive;

    function wakeScheduleController($scope, $element, $attrs) {
      $scope.wake.schedules = [];
      $scope.removeSchedule = removeSchedule;
      $scope.addSchedule = addSchedule;
      $scope.days = WakeSettings.days();
      $scope.years = WakeSettings.years();
      $scope.hours = WakeSettings.hours();
      $scope.timePeriods = WakeSettings.timePeriods();

      function addSchedule(schedule){
        $scope.wake.schedules.push(angular.copy(schedule));
        $scope.schedule = {};
      }

      function removeSchedule(index){
        $scope.wake.schedules.splice(index, 1);
      }
    }
  }
})();