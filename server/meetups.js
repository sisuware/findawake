(function(){
  'use strict';
  var Q = require('q');
  var Notify = require('./notify');

  module.exports = function Meetups(firebaesRef) {
    var firebaesRef = firebaesRef;

    var service = {
      process: process
    };

    return service;

    /**
     * Process new meetups from the queue
     */
    function process(task) {
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      return Q.all([
        _acceptedRidersData(data.wakeId),
        _meetupData(data.wakeId, data.meetupId),
        _wakeData(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      var promises = [];
      var riders = results[0];
      var meetup = results[1];
      var wake = results[2];
      var info = _wakeMeetupInfo(meetup, wake);

      riders.forEach(function(rider) {
        promises.push(_notifyRider(rider, info));
      });

      return Q.all(promises);
    }

    function _notifyRider(rider, info) {
      var dfr = Q.defer();
      var usersRef = firebaesRef.child('users');
      var promises = [];

      if (!rider.notification || !rider.userId) {
        dfr.reject();
      }

      debugger;

      usersRef
        .child(rider.userId)
        .on('value', function success(user) {
          info.name = user.name;
          
          if (rider.notification.email) {
            info.email = user.email;
            promises.push(Notify.email(info));
          }

          if (rider.notification.text) {
            // todo: need to have a verified flag
            info.cell = user.cell.value
            promises.push(Notify.sms(info));
          }

          dfr.resolve(Q.all(promises));
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _wakeMeetupInfo(meetup, wake) {
      var datum = {
        'date': meetup.date,
        'time': meetup.time,
        'location': meetup.location.undefined,
        'address': meetup.location.formatted,
        'wake': _parseWakeInfo(wake),
        'wakeHref': _generateWakeHref(wake)
      };

      return datum;
    }

    function _acceptedRidersData(wakeId) {
      var dfr = Q.defer();
      var acceptedRequestsRef = firebaesRef.child('accepted_requests');
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
      var requestsRef = firebaesRef.child('requests');

      requestsRef
        .child(wakeId)
        .child(requestId)
        .on('value', function success(snapshot) {
          dfr.resolve(snapshot.val());
        }, function failure(error) {
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function _meetupData(wakeId, meetupId) {
      var dfr = Q.defer();
      var meetupsRef = firebaesRef.child('meetups');

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
      var wakesRef = firebaesRef.child('wakes');

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
      return 'http://findawake/wakes/' + wake.id;
    }

    function _log(message) {

    }
  }
})();