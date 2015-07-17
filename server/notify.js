(function(){
  'use strict';
  var Request = require('request');
  var Q = require('q');
  var config = require('./config');

  module.exports = function Notify() {
    var service = {
      welcomeEmail: welcomeEmail,
      meetupEmail: meetupEmail,
      sms: sms
    };

    return service;

    function welcomeEmail(data) {
      return _email(config.zapier.email.welcome, data);
    }

    function meetupEmail(data) {
      return _email(config.zapier.email.meetup, data);
    }

    function _email(url, data) {
      var dfr = Q.defer();

      Request.post({url: url, body: data, json: true}, function(error, httpResponse, body){
        if (error) {
          dfr.reject(error);
        } else {
          dfr.resolve();
        }
      });  

      return dfr.promise;
    }

    function sms(data) {
      var dfr = Q.defer();

      Request.post({url: config.zapier.sms, body: data, json: true}, function(error, httpResponse, body){
        if (error) {
          dfr.reject(error);
        } else {
          dfr.resolve();
        }
      });  
      
      return dfr.promise;
    }
  }
})();