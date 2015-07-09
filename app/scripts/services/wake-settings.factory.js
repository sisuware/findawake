(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('WakeSettings', WakeSettings);

  WakeSettings.$inject = ['$timeout', '$q', 'Geocoder'];  
  
  // this should really be a directive, just saying.
  function WakeSettings($timeout, $q, Geocoder) {
    var service = {
      years: listYears,
      days: listDays,
      hours: listHours,
      timePeriods: listTimePeriods,
      wakeTypes: listBoardTypes
    };

    return service;

    function listYears(){
      var currentYear = new Date().getFullYear()+1,
        years = [],
        startYear = 1970;
      while ( startYear <= currentYear ) {
        years.unshift(startYear++);
      }
      return years;
    }

    function listDays(){
      var days =  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      return days;
    }

    function listHours(){
      var hours = [],
        startHour = 1,
        endHour = 12;
      while(startHour <= endHour) {
        hours.push(startHour++);
      }
      return hours;
    }

    function listTimePeriods(){
      var periods = ['AM','PM'];
      return periods;
    }

    function listBoardTypes(){
      // var types = [
        // {name:'wakeboarding', selected:true},
        // {name:'wakesurfing', selected:false},
        // {name:'wakeskating', selected:false}
      // ];

      var types = ['wakeboarding','wakesurfing','wakeskating'];
      return types;
    }
  }
})();