(function(){
  'use strict';
  var Q = require('q');
  var Moment = require('moment');

  var Notify = require('../notify')();
  var Log = require('../log');
  var config = require('../config');

  module.exports = function Meetups(firebaseRef) {
    var firebaseRef = firebaseRef;

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
        _acceptedRidersData(data.wakeId),
        _meetupData(data.wakeId, data.meetupId),
        _wakeData(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      Log.info('process task data results', results);
      var promises = [];
      var riders = results[0];
      var meetup = results[1];
      var wake = results[2];
      var info = _meetupInfo(meetup, wake);

      riders.forEach(function(rider) {
        promises.push(_notifyRider(rider, info));
      });

      return Q.all(promises);
    }

    function _notifyRider(rider, info) {
      Log.info('notify rider', rider)
      var dfr = Q.defer();
      var usersRef = firebaseRef.child('users');
      var promises = [];

      if (!rider.notification || !rider.userId) {
        dfr.reject();
      }

      usersRef
        .child(rider.userId)
        .once('value', function success(user) {
          var user = user.val();
          
          if (rider.notification.email) {
            info.name = user.name;
            info.email = user.email;

            Log.info('emailing rider', info);
            promises.push(Notify.meetupEmail(info));
          }

          if (rider.notification.text) {
            info.number = user.cell.value;

            Log.info('texting rider', info);
            promises.push(Notify.sms(info));
          }

          Q.all(promises).then(dfr.resolve, dfr.reject);
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _meetupInfo(meetup, wake) {
      var datum = {
        'date': Moment(meetup.date).format(config.moment.dateFormat),
        'time': Moment(meetup.time).format(config.moment.timeFormat),
        'location': meetup.location.undefined,
        'address': meetup.location.formatted,
        'wake': _parseWakeInfo(wake),
        'wakeHref': _generateWakeHref(wake),
        'directions': _generateDirectionsHref(meetup)
      };

      return datum;
    }

    function _acceptedRidersData(wakeId) {
      var dfr = Q.defer();
      var acceptedRequestsRef = firebaseRef.child('accepted_requests');
      var promises = [];

      acceptedRequestsRef
        .child(wakeId)
        .once('value', function success(snapshot) {
          snapshot.forEach(function(request) {
            promises.push(_riderRequestData(wakeId, request.val()));
          });

          Q.all(promises).then(dfr.resolve, dfr.reject);

        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _riderRequestData(wakeId, requestId) {
      var dfr = Q.defer();
      var requestsRef = firebaseRef.child('requests');

      requestsRef
        .child(wakeId)
        .child(requestId)
        .once('value', function success(snapshot) {
          dfr.resolve(snapshot.val());
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _meetupData(wakeId, meetupId) {
      var dfr = Q.defer();
      var meetupsRef = firebaseRef.child('meetups');

      meetupsRef
        .child(wakeId)
        .child(meetupId)
        .once('value', function success(snapshot) {
          dfr.resolve(snapshot.val());
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _wakeData(wakeId) {
      var dfr = Q.defer();
      var wakesRef = firebaseRef.child('wakes');

      wakesRef
        .child(wakeId)
        .once('value', function success(snapshot) {
          dfr.resolve(snapshot.val());
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _parseWakeInfo(wake) {
      return [wake.boat.year, wake.boat.make, wake.boat.model].join(' ');
    }

    function _generateWakeHref(wake) {
      return config.uri + 'wakes/' + wake.id;
    }

    function _generateDirectionsHref(meetup) {
      return 'http://maps.google.com/maps?daddr=' + meetup.location.lat + ',' + meetup.location.lng
    }
  }
})();