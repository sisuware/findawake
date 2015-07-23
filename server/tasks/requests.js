(function(){
  'use strict';
  var Q = require('q');
  var _ = require('lodash');

  var Log = require('../log');
  var config = require('../config');
  var Notify = require('../notify')();

  module.exports = function Requests(Models) {
    var service = {
      process: process
    };

    return service;

    function process(task) {
      Log.info('starting Request task', task)
      var dfr = Q.defer();

      _updateRequest(task)
        .then(_collectAssociatedTaskData)
        .then(_notifyRider.bind(null, task))
        .then(dfr.resolve, dfr.reject)

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('collecting associated data', data)
      return Q.all([
        Models.getRequest(data.wakeId, data.requestId),
        Models.getWake(data.wakeId)
      ]);
    }

    function _notifyRider(task, results) {
      Log.info('notifying rider', task); 
      var dfr = Q.defer();
      var request = results[0];
      var wake = results[1];
      
      Models
        .getUser(request.userId)
        .then(function(user){
          var emailData = _requestEmailData(wake, user, task);
          Log.info('emailing user', emailData);
          Notify.requestEmail(emailData).then(dfr.resolve, dfr.reject);
        }, dfr.reject);

      return dfr.promise;
    }

    function _updateRequest(task) {
      Log.info('updating request', task);
      var dfr = Q.defer();

      Models
        .updateRequest(task.wakeId, task.requestId, task.accepted)
        .then(function(){
          Log.success('succesfully updated request', task);
          dfr.resolve(task);
        }, function(errors){
          Log.error('failed to update request', errors);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _requestEmailData(wake, user, task) {
      var datum = {
        'wake': _.pick(wake.boat, 'year','make','model'),
        'wakeHref': _generateWakeHref(wake),
        'name': user.name,
        'to': user.email,
        'accepted': task.accepted,
        'subject': 'Ride request ' + (task.accepted ? 'accepted':'declined')
      };

      return datum;
    }

    function _generateWakeHref(wake) {
      return config.uri + 'wakes/' + wake.id;
    }
  }
})();