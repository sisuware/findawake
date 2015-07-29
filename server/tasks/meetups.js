(function(){
  'use strict';
  var Q = require('q');
  var Moment = require('moment');
  var _ = require('lodash');

  var Notify = require('../notify')();
  var Log = require('../log');
  var config = require('../config');
  var Google = require('../google');

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
        Models.getMeetup(data.wakeId, data.meetupId),
        Models.getWake(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      Log.info('process task data results', results);
      var dfr = Q.defer();
      var promises = [];
      var requests = results[0];
      var meetup = results[1];
      var wake = results[2];

      _meetupInfo(meetup, wake)
        .then(function(info){
          requests.forEach(function (request) {
            promises.push(_notifyUser(request, info));
          });

          Q.all(promises).then(dfr.resolve, dfr.reject);
        }, dfr.reject);
      return dfr.promise;
    }

    function _notifyUser(request, info) {
      Log.info('notify user of meetup', request)
      var dfr = Q.defer();
      var promises = [];

      if (!request.notification || !request.userId) {
        dfr.reject();
      }

      Models
        .getUser(request.userId)
        .then(function (user) {
          if (request.notification.email) {
            info.name = user.name;
            info.to = user.email;
            info.subject = 'Meetup has been scheduled';
            Log.info('emailing user', info);
            promises.push(Notify.email('meetup',info));
          }

          if (request.notification.text) {
            info.number = user.cell.value;

            Log.info('texting user', info);
            promises.push(Notify.sms(info));
          }

          Q.all(promises).then(dfr.resolve, dfr.reject);
        }, dfr.reject);

      return dfr.promise;
    }

    function _meetupInfo(meetup, wake) {
      var dfr = Q.defer();
      var location = [meetup.location.lat,meetup.location.lng].join(',');
      var datum = {
        'date': Moment(meetup.date).format(config.moment.dateFormat),
        'time': Moment(meetup.time).format(config.moment.timeFormat),
        'location': meetup.location.undefined,
        'address': meetup.location.formatted,
        'wake': _.pick(wake.boat, 'year','make','model'),
        'wakeHref': _generateWakeHref(wake)
      };

      Q.all([
        Google.getTimezone(location),
        Google.urlShorten(_generateDirectionsUrl(location))
      ])
      .then(function(results){
        var timezone = results[0];
        var directions = results[1];
        
        meetup.directions = directions.id || false;
        meetup.timezone = timezone || false;
        datum.directions = directions.id;

        Models.updateMeetup(wake.id, meetup.id, meetup);

        dfr.resolve(datum);
      });

      return dfr.promise;
    }

    function _generateWakeHref(wake) {
      return 'http://' + config.uri + 'wakes/' + wake.id;
    }

    function _generateDirectionsUrl(location) {
      return 'http://maps.google.com/maps?daddr=' + location;
    }
  }
})();