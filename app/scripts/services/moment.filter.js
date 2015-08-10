(function(){
  'use strict';

  angular
    .module('findAWake')
    .filter('moment', Moment);

  function Moment() {
    return function (time, fn) {
      var parsed =  moment(time);
      if (fn) {
        parsed = parsed[fn]();
      } 
      return parsed;
    };
  }
})();