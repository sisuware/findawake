(function(){
  'use strict';

  var Google = require('googleapis');
  var Gmail = Google.gmail('v1');
  var UrlShortener = Google.urlshortener('v1');
  var Q = require('q');
  var Log = require('./log');
  var Request = require('request');
  var config = require('./config');
  
  var googleAuth = new Google.auth.JWT(config.google.auth.client_email, null, config.google.auth.private_key, config.google.auth.scopes, config.google.user);

  var service = {
    sendMessage: sendMessage,
    urlShorten: urlShorten,
    getTimezone: getTimezone
  };

  module.exports = service;

  function urlShorten(url) {
    var dfr = Q.defer();
    
    _authorize()
      .then(function(auth){
        UrlShortener.url.insert({resource:{'longUrl':url}, 'auth':auth}, function(err, response){
          if (err) {
            dfr.reject(err);
          } else {
            dfr.resolve(response);
          }
        });
      });

    return dfr.promise;
  }

  function sendMessage(message) {
    var dfr = Q.defer();
    Log.info('attempting to send email through Gmail');

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

  function getTimezone(location) {
    var dfr = Q.defer();
    var url = config.google.apis.timezone + '?auth=' + config.google.apiKey + '&location=' + location + '&timestamp=' + (new Date().valueOf()/1000);

    Request.get({url:url, json:true}, function(error, httpResponse, body){
      if (error) {
        dfr.reject(error);
      } else {
        dfr.resolve(body);
      }
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
        Log.info('authorized with google', tokens);
        dfr.resolve(googleAuth);
      }
    });

    return dfr.promise;
  }
})();