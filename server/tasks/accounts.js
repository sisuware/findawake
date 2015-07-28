(function(){
  'use strict';
  var Q = require('q');
  var Moment = require('moment');

  var Notify = require('../notify')();
  var Log = require('../log');
  var config = require('../config');

  module.exports = function Accounts(Models) {
    var service = {
      process: process
    };

    return service;

    /**
     * Process new accounts from the queue
     */
    function process(task) {
      Log.info('processing task as a new account', task)
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults.bind(null, task))
        .then(dfr.resolve, dfr.reject)
        .done();

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('fetching new user data', data)
      return Models.getUser(data.userId);
    }

    function _processTaskDataResults(task, user) {
      Log.info('prepareing to email the new user', user);
      var dfr = Q.defer();
      
      Models
        .createUserHash(task.userId)
        .then(function(hash){
          Notify
            .email('welcome', _welcomeEmailData(user, hash))
            .then(dfr.resolve, dfr.reject);
        }, dfr.reject);

      return dfr.promise;
    }

    function _welcomeEmailData(user, hash) {
      var datum = {
        'created': Moment(user.created).format(config.moment.dateFormat + ', ' + config.moment.timeFormat),
        'to': user.email,
        'name': user.name,
        'verifyEmailHref': _generateValidationHashHref(hash),
        'subject': 'Welcome to Find A Wake'
      };

      return datum;
    }

    function _generateValidationHashHref(hash) {
      return 'http://' + config.uri + 'verify/email/' + hash;
    }
  }
})();