(function(){
  'use strict';
  var Request = require('request');
  var Q = require('q');
  var emailHook = 'https://zapier.com/hooks/catch/bl3xal/';
  var smsHook = 'https://zapier.com/hooks/catch/bl8yfa/';

  module.exports = function Notify() {
    var service = {
      email: email,
      sms: sms
    };

    return service;

    function email(data) {
      var dfr = Q.defer();

      Request.post({url: emailHook, body: data, json: true}, function(error, httpResponse, body){
        console.log(httpResponse);
        if (error) {
          console.log(error);
          dfr.reject(error);
        } else {
          dfr.resolve();
        }
      });  

      return dfr.promise;
    }

    function sms(data) {
      var dfr = Q.defer();

      // Request.post({url: emailHook, formData: info}, function(error, httpResponse, body){
      //   if (error) {
      //     dfr.reject(error);
      //   } else {
      //     dfr.resolve();
      //   }
      // });  
      
      dfr.resolve();

      return dfr.promise;
    }
  }
})();