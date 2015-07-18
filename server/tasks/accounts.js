(function(){
  'use strict';
  var Q = require('q');
  var crypto = require('crypto');
  var Moment = require('moment');

  var Notify = require('../notify')();
  var Log = require('../log');
  var config = require('../config');

  module.exports = function Accounts(firebaseRef) {
    var firebaseRef = firebaseRef;

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
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('collecting associated data', data)
      return _userData(data.userId)
    }

    function _processTaskDataResults(data) {
      Log.info('process task data results', data);

      return _generateValidationHash(data).then(function(hash){
        var email = _welcomeUserEmail(data, hash);
        Log.info('emailing new user', email);
        return Notify.welcomeEmail(email);
      }, function(errors){
        Log.error('failed to generate validation hash', errors);
      });
    }

    function _welcomeUserEmail(user, hash) {
      var datum = {
        'created': Moment(user.created).format(config.moment.dateFormat + ', ' + config.moment.timeFormat),
        'email': user.email,
        'name': user.name,
        'verifyEmailHref': _generateValidationHashHref(hash)
      };

      return datum;
    }

    function _generateValidationHash(user) {
      Log.info('generating unique validation hash');
      var dfr = Q.defer();
      var hash = crypto.randomBytes(20).toString('hex');
      var hashes = firebaseRef.child('hashes');

      hashes
        .child(hash)
        .set(user.userId, function(error){
          if (error) {
            Log.error('error saving unique validation hash', error);
            dfr.reject(error);
          } else {
            Log.success('saved unique validation hash', hash);
            dfr.resolve(hash);
          }
        });

      return dfr.promise;
    }

    function _generateValidationHashHref(hash) {
      return config.uri + 'account/verify/email/' + hash;
    }

    function _userData(userId) {
      var dfr = Q.defer();
      var users = firebaseRef.child('users');

      users
        .child(userId)
        .once('value', function success(snapshot){
          dfr.resolve(snapshot.val());
        }, function failure(error){
          Log.error('failed to get user snapshot', userId);
          dfr.reject(error);
        });

      return dfr.promise;
    }
  }
})();