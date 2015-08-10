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
      newMeetup: newMeetup,
      newMeetupData: newMeetupData
    };

    return service;

    function newMeetup(task) {
      Log.info('processing new meetup', task)
      var dfr = Q.defer();

      _collectAssociatedData(task)
        .then(_processMeetupData)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function newMeetupData(task) {
      Log.info('processing new meetup data', task)
      var dfr = Q.defer();
      
      Models
        .queryAcceptedRequests(task.wakeId)
        .then(_processAcceptedRequests.bind(task))
        .then(function(requsts){
          task.requests = requests;
          dfr.resolve(task);
        }, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedData(data) {
      Log.info('collecting associated meetup data', data)
      
      return Q.all([
        Models.getMeetup(data.wakeId, data.meetupId),
        Models.getWake(data.wakeId)
      ]);
    }

    function _processMeetupData(results) {
      Log.info('process task data results', results);
      var dfr = Q.defer();
      var meetup = results[0];
      var wake = results[1];
      var location = [meetup.location.lat,meetup.location.lng].join(',');

      Q.all([
        Google.getTimezone(location),
        Google.urlShorten(_generateDirectionsUrl(location))
      ])
      .then(function(results){
        var timezone = results[0];
        var directions = results[1];
        var utc = (parseInt(timezone.rawOffset) / 60) || '';
        var date = Moment(meetup.date).utcOffset(utc);
        var time = Moment(meetup.time).utcOffset(utc); 
        
        var datum = {
          'meetupId': meetup.id,
          'wakeId': wake.id,
          'date': date.format(config.moment.dateFormat),
          'time': time.format(config.moment.timeFormat),
          'fromNow': date.fromNow(),
          'location': meetup.location.undefined || meetup.location.point_of_interest,
          'address': meetup.location.formatted,
          'wake': _.pick(wake.boat, 'year','make','model'),
          'wakeHref': _generateWakeHref(wake),
          'directions': directions.id
        };

        Models
          .updateMeetup(wake.id, meetup.id, {'directions':directions, 'timezone':_.omit(timezone,'status')})
          .then(dfr.resolve.bind(null, datum), dfr.reject);
      });

      return dfr.promise;
    }

    function _processAcceptedRequests(requests) {
      var dfr = Q.defer();
      var promises = [];
      
      requests.forEach(function(request){
        if (request.notification && request.userId) {
          promises.push(_parseRequest(request));
        } else {
          Log.error('request is missing notification or user id', request);
        }
      });

      Q.all(promises).then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _parseRequest(request){
      var dfr = Q.defer();
      var datum = {};

      Models.getUser(request.userId).then(function(user){
        datum.name = user.name;

        if (request.notification.email && user.email && user.emailVerified) {
          datum.email = user.email;
        } else {
          Log.error('user has no email or email is not verified', user);
        }
        if (request.notification.text && user.cell.value) {
          datum.number = user.cell.value;
        }

        dfr.resolve(datum);
      }, dfr.reject);

      return dfr.promise;
    }

    // function _notifyUser(request, info) {
    //   Log.info('notify user of meetup', request);
    //   var dfr = Q.defer();
    //   var promises = [];

    //   if (!request.notification || !request.userId) {
    //     dfr.reject();
    //   }

    //   Models
    //     .getUser(request.userId)
    //     .then(function (user) {
    //       if (request.notification.email) {
    //         info.name = user.name;
    //         info.to = user.email;
    //         info.subject = 'Meetup has been scheduled';
    //         Log.info('emailing user', info);
    //         promises.push(Notify.email('meetup',info));
    //       }

    //       if (request.notification.text) {
    //         info.number = user.cell.value;

    //         Log.info('texting user', info);
    //         promises.push(Notify.sms(info));
    //       }

    //       Q.all(promises).then(dfr.resolve, dfr.reject);
    //     }, dfr.reject);

    //   return dfr.promise;
    // }

    function _generateWakeHref(wake) {
      return 'http://' + config.uri + 'wakes/' + wake.id;
    }

    function _generateDirectionsUrl(location) {
      return 'http://maps.google.com/maps?daddr=' + location;
    }
  }
})();