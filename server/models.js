(function(){
  'use strict';
  var Q = require('q');
  var Log = require('../log');

  module.exports = function Models(firebaseRef) {
    var firebaseRef = firebaseRef;

    var service = {
      queryRequests: queryRequests,
      queryAcceptedRequests: queryAcceptedRequests,
      getRequest: getRequest,
      getUser: getUser,
      getMeetup: getMeetup,
      getWake: getWake
    };

    return service;

    function queryRequests(id) {
      var dfr = Q.defer();
      var requests = firebaseRef.child('requests');

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
      var requests = firebaseRef.child('requests');

      requests
        .child(id)
        .orderByChild('accepted')
        .equalTo(true)
        .once('value', function(snapshot){
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get accepted requests snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise; 
    }    

    function getRequest(request) {
      var dfr = Q.defer();
      var requests = firebaseRef.child('requests');

      requests
        .child(request.wakeId)
        .child(request.requestId)
        .once('value', function(snapshot){
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get request snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function getUser(id) {
      var dfr = Q.defer();
      var users = firebaseRef.child('users');

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

    function getMeetup(meetup) {
      var dfr = Q.defer();
      var meetupsRef = firebaseRef.child('meetups');

      meetupsRef
        .child(meetup.wakeId)
        .child(meetup.meetupId)
        .once('value', function(snapshot) {
          dfr.resolve(snapshot.val());
        }, function(error) {
          Log.error('failed to get meetup snapshot', error);
          dfr.reject(error);
        });

      return dfr.promise;
    }

    function getWake(id) {
      var dfr = Q.defer();
      var wakesRef = firebaseRef.child('wakes');

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
  }
});