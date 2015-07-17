(function(){
  'use strict';
  var Q = require('q');
  var Notify = require('./notify')();
  var Moment = require('moment');
  var Bitly = require('bitly');
  var bitly = new Bitly('simook', 'R_cd58051cae174632bb3cadfcaa284f12');
  
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
      _log('processing task', task)
      var dfr = Q.defer();

      _collectAssociatedTaskData(task)
        .then(_processTaskDataResults)
        .then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function _collectAssociatedTaskData(data) {
      _log('collecting associated data', data)
      return Q.all([
        _acceptedRidersData(data.wakeId),
        _meetupData(data.wakeId, data.meetupId),
        _wakeData(data.wakeId)
      ]);
    }

    function _processTaskDataResults(results) {
      _log('process task data results', results);
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
      _log('notify rider', rider)
      var dfr = Q.defer();
      var usersRef = firebaesRef.child('users');
      var promises = [];

      if (!rider.notification || !rider.userId) {
        dfr.reject();
      }

      usersRef
        .child(rider.userId)
        .on('value', function success(user) {
          var user = user.val();
          
          if (rider.notification.email) {
            info.name = user.name;
            info.email = user.email;

            _log('emailing rider', info);
            promises.push(Notify.email(info));
          }

          if (rider.notification.text) {
            info.number = user.cell.value;

            _log('texting rider', info);
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
        'date': Moment(meetup.date).format('dddd, MMMM Do'),
        'time': Moment(meetup.time).format('h:mm a'),
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
      return 'http://findawake.com/wakes/' + wake.id;
    }

    function _generateDirectionsHref(meetup) {
      return 'http://maps.google.com/maps?daddr=' + meetup.location.lat + ',' + meetup.location.lng
    }

    function _log(message, data) {
      console.log('\x1b[42m', 'Meetups.' + Date.now() + ': ' + message, '\x1b[0m');
      if (data) {
        console.log('\x1b[0m',JSON.stringify(data),'\n');
      }
    }
  }
})();