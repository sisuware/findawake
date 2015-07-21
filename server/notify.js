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
      return _zapierEmail(config.zapier.email.welcome, data);
    }

    function meetupEmail(data) {
      return _zapierEmail(config.zapier.email.meetup, data);
    }

    function requestEmail(data) {
      return _sendEmailMessage(data);
    }

    function _zapierEmail(url, data) {
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

    function _sendEmailMessage(data) {
      var dfr = Q.defer();
      console.log(data);
      dfr.resolve(data);

      return dfr.promise;
    }
  }
})();