(function(){
  'use strict';
  var Log = require('./log');

  module.exports = function Specs(ref) {
    var specs = [
      'new_meetup',
      'new_meetup_data',
      'new_meetup_notification'
    ];

    var Models = require('./models')(ref);

    var Meetups = require('./specs/meetups')(Models);
    var Accounts = require('./specs/accounts')(Models);
    var Profiles = require('./specs/profiles')(Models);
    var Requests = require('./specs/requests')(Models);    

    var service = {
      'query': specs,
      'new_meetup': newMeetup,
      'new_meetup_data': newMeetupData,
      'new_meetup_notification': newMeetupNotification
    };

    return service;
  
    function newMeetup(data, progress, resolve, reject) {
      Log.info('recieved new meetup task', data);
      
      Meetups
        .newMeetup(data)
        .then(resolve, reject);
    }

    function newMeetupData(data, progress, resolve, reject) {
      Log.info('recieved new meetup data task', data);
      
      Meetups
        .newMeetupData(data)
        .then(resolve, reject);
    }

    function newMeetupNotification(data, progress, resolve, reject) {
      console.log(data);
    }
  }
})();