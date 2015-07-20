(function(){
  'use strict';
  var Q = require('q');
  var _ = require('lodash');

  var Log = require('../log');
  var config = require('../config');

  module.exports = function Requests(Models) {
    var service = {
      process: process
    };

    return service;

    function process(task) {
      Log.info('starting Request task', task)
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('collecting associated data', data)
      return Q.all([
        Models.getRequest(data),
        Models.getWake(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      Log.info('process task data results', data);
      var request = results[0];
      var wake = results[1];
            
    }
  }
})();