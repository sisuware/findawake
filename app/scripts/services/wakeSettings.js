'use strict';
/*global _:false */

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */

var app = angular.module('findawakeApp');

app.factory('WakeSettings', function($timeout, $q, Geocoder){
  var wakeSettingsService = {}, validationTimeout;

  wakeSettingsService.init = function($scope){
    if(_.isNull($scope.wake) || _.isUndefined($scope.wake)){
      $scope.wake = {};
      $scope.wake.schedules = [];
      $scope.wake.types = listBoardTypes();
    }
      $scope.location = {};
      $scope.years = listYears();
      $scope.days = listDays();
      $scope.hours = listHours();
      $scope.timePeriods = listTimePeriods();
  };

  wakeSettingsService.validateLocation = function(location, callback){
    /*jshint camelcase: false */
    var l = location;
    if(_.isEmpty(l) || _.isEmpty(l.city) || _.isEmpty(l.state)) { return false; }

    if(!_.isUndefined(validationTimeout)){
      $timeout.cancel(validationTimeout);
      validationTimeout = undefined;
    }
    validationTimeout = $timeout(function(){
      Geocoder.geocode('address', location).then(function(res){
        if(callback){
          callback(formatGeocodeResults(res));
        }
      });
    }, 1000);
  };

  function formatGeocodeResults(results){
    return _.map(results, function(result){
      var obj = {};
      /*jshint camelcase: false */
      _.each(result.address_components, function(address){
        obj[_.first(address.types)] = address.long_name;
      });
      obj.formatted = result.formatted_address;
      obj.lat = result.geometry.location.lat();
      obj.lng = result.geometry.location.lng();
      return obj;
    });
  }

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
    var types = [
      {name:'wakeboarding',selected:true},
      {name:'wakesurfing',selected:false},
      {name:'wakeskating',selected:false}
    ];
    return types;
  }

  return wakeSettingsService;
});