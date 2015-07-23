var FirebaseTokenGenerator = require('firebase-token-generator');
var Firebase = require('firebase');
var Log = require('../log');
var config = require('../config');

var ref = new Firebase(config.firebase.account);
var Models = require('../models')(ref);

var Meetups = require('../tasks/meetups')(Models);
var Accounts = require('../tasks/accounts')(Models);
var Profiles = require('../tasks/profiles')(Models);
var Requests = require('../tasks/requests')(Models);

var tokenGenerator = new FirebaseTokenGenerator(config.firebase.token);
var token = tokenGenerator.createToken({}, {'admin': true});

ref.authWithCustomToken(token, function(error, authData){
  if (error) {
    Log.error('authentication failed', error);
    return false;
  }

  runTests();
});

var meetupTask = {
  meetupId: '-JuHX2c--XKn8JFrRBVJ',
  wakeId: '-Ju2pVidXn6wEmzEmDgV',
  task: 'meetup'
};

var welcomeTask = {
  userId: 'simplelogin:28'
};

var profileTask = {

};

var acceptedRequestTask = {
  accepted: true,
  wakeId: '-Ju2pVidXn6wEmzEmDgV',
  requestId: '-Ju3fiHeG_-Y6dj9heJv'
};

var declinedRequestTask = {
  accepted: false,
  wakeId: '-Ju2pVidXn6wEmzEmDgV',
  requestId: '-Ju3fiHeG_-Y6dj9heJv'
};

function runTests() {
  // Requests
  //   .process(acceptedRequestTask)
  //   .then(_handleSuccess, _handleError)
  //   .done(_handleDone);

  // Requests
  //   .process(declinedRequestTask)
  //   .then(_handleSuccess, _handleError)
  //   .done(_handleDone);

  Meetups
    .process(meetupTask)
    .then(_handleSuccess, _handleError)
    .done(_handleDone);
    
  // Accounts
  //   .process(welcomeTask)
  //   .then(_handleSuccess, _handleError)
  //   .done(_handleDone);
}

function _handleSuccess(results) {
  Log.success('Completed tasks', results);
}

function _handleError(error) {
  Log.error('Tasks failed', error);
}

function _handleDone(results) {
  Log.info('Testing done', results);
}