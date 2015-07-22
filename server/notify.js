(function(){
  'use strict';
  
  var Request = require('request');
  var Google = require('googleapis');
  var Gmail = Google.gmail('v1');
  var Q = require('q');
  var Btoa = require('btoa');
  var Log = require('./log');
  var googleKey = require('./google.json');
  var config = require('./config');

  var googleAuth = new Google.auth.JWT(googleKey.client_email, null, googleKey.private_key, config.google.gmailScope, null);

  module.exports = function Notify() {
    var service = {
      welcomeEmail: welcomeEmail,
      meetupEmail: meetupEmail,
      requestEmail: requestEmail,
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

      var message = Btoa(data);
      
      _authorize()
        .then(function(auth){
          Gmail.users.messages.send({
            'auth': auth,
            'userId': data.email,
            'message': {
              'raw': message
            }
          }, function(res){
            if (res && res.type === 'error') {
              Log.error('failed to send message', res);
              dfr.reject(res);
            } else {
              Log.success('succesfully sent message', res);
              dfr.resolve(res);  
            }
          });
        });


      return dfr.promise;
    }

    function _authorize() {
      var dfr = Q.defer();
      googleAuth.authorize(function(error, tokens) {
        if (error) {
          Log.error('failed to authorize with Goggle', error)
          dfr.reject(error);
        } else {
          dfr.resolve(googleAuth);
        }
      });

      return dfr.promise;
    }
  }
})();