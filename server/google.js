(function(){
  'use strict';

  var Google = require('googleapis');
  var Gmail = Google.gmail('v1');
  var Q = require('q');
  var Log = require('./log');
  var config = require('./config');

  var googleAuth = new Google.auth.JWT(config.google.auth.client_email, null, config.google.auth.private_key, config.google.auth.scopes, config.google.user);

  var service = {
    sendMessage: sendMessage
  };

  module.exports = service;

  function sendMessage() {
    var dfr = Q.defer();
    Log.info('attempting to send email through Gmail');

    var message = "To: simook@gmail.com\n" +
                  "From: support@findawake.com\n" +
                  "Subject: Subject Text\n\n" +
    
                  "The actual message text goes here";
    
    _authorize()
      .then(function(auth){
        Gmail.users.messages.send({
          'auth': auth,
          'userId': 'me',
          media: {
            mimeType: 'message/rfc822',
            body: message
          }
        }, function(res){
          if (res && res.code !== 200) {
            Log.error('failed to send message', res);
            dfr.reject(res);
          } else {
            Log.success('succesfully sent message', res);
            dfr.resolve(res);  
          }
        });
      }, dfr.reject);


    return dfr.promise;
  }

  function _messageBody() {

  }

  function _authorize() {
    var dfr = Q.defer();
    googleAuth.authorize(function(error, tokens) {
      if (error) {
        Log.error('failed to authorize with Goggle', error)
        dfr.reject(error);
      } else {
        Log.info('authorized with google', tokens);
        dfr.resolve(googleAuth);
      }
    });

    return dfr.promise;
  }
})();