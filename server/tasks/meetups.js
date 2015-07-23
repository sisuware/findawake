(function(){
  'use strict';
  var Q = require('q');
  var Moment = require('moment');

  var Notify = require('../notify')();
  var Log = require('../log');
  var config = require('../config');

  module.exports = function Meetups(Models) {
    var service = {
      process: process
    };

    return service;

    /**
     * Process new meetups from the queue
     */
    function process(task) {
      Log.info('processing task as a Meetup', task)
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      Log.info('collecting associated data', data)
      return Q.all([
        Models.queryAcceptedRequests(data.wakeId),
        Models.getMeetup(data),
        Models.getWake(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      Log.info('process task data results', results);
      var promises = [];
      var riders = results[0];
      var meetup = results[1];
      var wake = results[2];
      var info = _meetupInfo(meetup, wake);

      riders.forEach(function (rider) {
        promises.push(_notifyRider(rider, info));
      });

      return Q.all(promises);
    }

    function _notifyRider(rider, info) {
      Log.info('notify rider', rider)
      var dfr = Q.defer();
      var promises = [];

      if (!rider.notification || !rider.userId) {
        dfr.reject();
      }

      Models
        .getUser(rider.userId)
        .then(function (user) {
          if (rider.notification.email) {
            info.name = user.name;
            info.to = user.email;
            info.subject = 'Meetup has been scheduled';
            Log.info('emailing rider', info);
            promises.push(Notify.email('meetup',info));
          }

          if (rider.notification.text) {
            info.number = user.cell.value;

            Log.info('texting rider', info);
            promises.push(Notify.sms(info));
          }

          Q.all(promises).then(dfr.resolve, dfr.reject);
        }, dfr.reject);

      return dfr.promise;
    }

    function _meetupInfo(meetup, wake) {
      var datum = {
        'date': Moment(meetup.date).format(config.moment.dateFormat),
        'time': Moment(meetup.time).format(config.moment.timeFormat),
        'location': meetup.location.undefined,
        'address': meetup.location.formatted,
        'wake': _.pick(wake.boat, 'year','make','model'),
        'wakeHref': _generateWakeHref(wake),
        'directions': _generateDirectionsHref(meetup)
      };

      return datum;
    }

    function _generateWakeHref(wake) {
      return config.uri + 'wakes/' + wake.id;
    }

    function _generateDirectionsHref(meetup) {
      return 'http://maps.google.com/maps?daddr=' + meetup.location.lat + ',' + meetup.location.lng
    }
  }
})();