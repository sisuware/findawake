(function(){
  'use strict';
  
  var Request = require('request');
  var Q = require('q');
  var Log = require('./log');
  var config = require('./config');
  var Google = require('./google');
  var EmailTemplate = require('email-templates').EmailTemplate;
  var Handlebars = require('handlebars');
  var path = require('path')

  var templates = {
    meetupEmailDir: path.join(__dirname, 'templates', 'meetup-email'),
    acceptedRequestEmailDir: path.join(__dirname, 'templates', 'accepted-request-email'),
    requestEmailDir: path.join(__dirname, 'templates', 'request-email'),
    welcomeEmailDir: path.join(__dirname, 'templates', 'welcome-email')
  };

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
      return _renderTemplate(data.accepted ? 'acceptedRequestEmailDir' : 'declinedRequestEmailDir', data)
        .then(Google.sendMessage)
        .done();
      //return Google.sendMessage(data);
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

    function _renderTemplate(templatesTarget, data) {
      var dfr = Q.defer();
      var template = new EmailTemplate(templates[templatesTarget]);

      template.render(data)
        .then(function(results){
          dfr.resolve(_compileRawMessage(data.to, data.subject, results.html));
        }, dfr.reject);

      return dfr.promise;
    }

    function _compileRawMessage(to, subject, html) {
      var _message  = 'To: ' + to + '\n';
          _message += 'From: ' + config.google.user + '\n';
          _message += 'Subject: ' + subject + '\n';
          _message += 'Content-Type: text/html; charset=UTF-8\n\n';
          _message += html;

      return _message;
    }   
  }
})();