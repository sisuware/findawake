(function(){
  'use strict';
  var Q = require('q');
  var BadWords = require('bad-words');
  var _ = require('lodash');

  var Log = require('../log');
  var config = require('../config');

  module.exports = function Profiles(Models) {
    var service = {
      process: process
    };

    return service;

    /**
     * Process new accounts from the queue
     */
    function process(task) {
      Log.info('starting Profile task', task)
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('collecting associated data', data)
      return Models.getUser(data.userId);
    }

    function _processTaskDataResults(data) {
      Log.info('process task data results', data);
      var dfr = Q.defer();
      var filter = new BadWords();
      var datum = _.pick(data,'avatar','bio','gear','location','name','boats');     

      if (datum.bio) {
        datum.bio = filter.clean(datum.bio);
      }
      if (datum.name) {
        datum.name = filter.clean(datum.name);
      }

      Models
        .updateProfile(data.userId, datum)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }
  }
})();