(function(){
  'use strict';
  var Q = require('q');
  var _ = require('lodash');

  var Log = require('../log');
  var config = require('../config');

  module.exports = function Requests(firebaseRef) {
    var firebaseRef = firebaseRef;

    var service = {
      process: process
    };

    return service;

    /**
     * Process new accounts from the queue
     */
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
      return _requestData(data.wakeId, data.requestId),
    }

    function _processTaskDataResults(data) {
      Log.info('process task data results', data);
      
      
    }

    function _requestData(wakeId, requestId) {
      var dfr = Q.defer();
      var requests = firebaseRef.child('requests');

      requests
        .child(wakeId)
        .child(requestId)
        .once('value', function(snapshot){
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get request snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
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