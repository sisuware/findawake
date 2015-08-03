(function(){
  'use strict';

  var Q = require('q');
  var Log = require('./log');
  var Crypto = require('crypto');

  module.exports = function Models(firebaseRef) {
    var firebaseRef = firebaseRef;
    var requests = firebaseRef.child('requests');
    var users = firebaseRef.child('users');
    var meetupsRef = firebaseRef.child('meetups');
    var wakesRef = firebaseRef.child('wakes');
    var hashes = firebaseRef.child('hashes');
    var profilesRef = firebaseRef.child('profiles');
    
    var service = {
      queryRequests: queryRequests,
      queryAcceptedRequests: queryAcceptedRequests,
      getRequest: getRequest,
      updateRequest: updateRequest,
      getUser: getUser,
      getMeetup: getMeetup,
      updateMeetup: updateMeetup,
      getWake: getWake,
      createUserHash: createUserHash,
      updateProfile: updateProfile
    };

    return service;

    function queryRequests(id) {
      var dfr = Q.defer();

      requests
        .child(id)
        .once('value', function(snapshot){
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get requests snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function queryAcceptedRequests(id) {
      var dfr = Q.defer();
      var acceptedRequests = [];
      
      requests
        .child(id)
        .once('value', function(requests){
          requests.forEach(function(request){
            if (request.child('accepted').val()) {
              acceptedRequests.push(request.val());
            }
          });

          dfr.resolve(acceptedRequests);         
        }, dfr.reject);

      return dfr.promise; 
    }    

    function getRequest(wakeId, requestId) {
      var dfr = Q.defer();

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

    function updateRequest(wakeId, requestId, data) {
      var dfr = Q.defer();

      requests
        .child(wakeId)
        .child(requestId)
        .child('accepted')
        .set(data, function(error){
          if (error) {
            Log.error('failed to update request', error);
            dfr.reject(error);
          } else {
            dfr.resolve();
          }
        });

      return dfr.promise;
    }

    function getUser(id) {
      var dfr = Q.defer();

      users
        .child(id)
        .once('value', function(snapshot){
          dfr.resolve(snapshot.val());
        }, function(error){
          Log.error('failed to get user snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function getMeetup(wakeId, meetupId) {
      var dfr = Q.defer();

      meetupsRef
        .child(wakeId)
        .child(meetupId)
        .once('value', function(snapshot) {
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get meetup snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function updateMeetup(wakeId, meetupId, data) {
      var dfr = Q.defer();

      meetupsRef
        .child(wakeId)
        .child(meetupId)
        .update(data, function(error){
          if (error) {
            Log.error('failed to update meetup', error);
            dfr.reject(error);
          } else {
            dfr.resolve();
          }
        });

      return dfr.promise;
    }

    function getWake(id) {
      var dfr = Q.defer();

      wakesRef
        .child(id)
        .once('value', function(snapshot) {
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get wake snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function createUserHash(id) {
      var dfr = Q.defer();
      var hash = Crypto.randomBytes(20).toString('hex');
      
      hashes
        .child(hash)
        .set(id, function(error){
          if (error) {
            Log.error('error saving unique validation hash', error);
            dfr.reject(error);
          } else {
            Log.info('saved unique validation hash', hash);
            dfr.resolve(hash);
          }
        });

      return dfr.promise;
    }

    function updateProfile(id, data) {
      var dfr = Q.defer();
      
      profilesRef
        .child(id)
        .set(data, function(error){
          if (error) {
            Log.error('failed to update public profile', error);
            dfr.reject(error);
          } else {
            Log.info('saved public profile', data);
            dfr.resolve(data);
          }
        });

      return dfr.promise;
    }
  }
})();