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
        .then(_processTaskDataResults.bind(null, task))
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(task) {
      Log.info('collecting associated data', task)
      return Models.getUser(task.userId);
    }

    function _processTaskDataResults(task, user) {
      Log.info('process profile results', user);
      var dfr = Q.defer();
      var filter = new BadWords();
      var datum = _.pick(user,'avatar','bio','gear','location','name','boats');     

      if (datum.bio) {
        datum.bio = filter.clean(datum.bio);
      }
      if (datum.name) {
        datum.name = filter.clean(datum.name);
      }

      Models
        .updateProfile(task.userId, datum)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }
  }
})();