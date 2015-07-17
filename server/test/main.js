var FirebaseTokenGenerator = require('firebase-token-generator');
var Firebase = require('firebase');
var config = require('../config');
var Log = require('../log');

var ref = new Firebase(config.firebase.account);
var Meetups = require('../meetups')(ref);
var Accounts = require('../accounts')(ref);

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator(config.firebase.token);
var token = tokenGenerator.createToken({}, {'admin': true});

ref.authWithCustomToken(token, function(error, authData){
  if (error) {
    Log.now('authentication failed', error);
    return false;
  }

  runTests();
});

function runTests() {

  var meetupTask = {
    meetupId: '-JuHX2c--XKn8JFrRBVJ',
    wakeId: '-Ju2pVidXn6wEmzEmDgV',
    task: 'meetup'
  };

  var welcomeTask = {
    userId: 'simplelogin:38'
  };

  Meetups.process(meetupTask).then(function(results){
    Log.success('Meetups testing complete', results);
  }, function(errors){
    Log.failed('Meetup testing failed', errors);
  });

  Accounts.process(welcomeTask).then(function(results){
    Log.success('Accounts testing complete', results);
  }, function(errors){
    Log.failed('Accounts testing failed', errors);
  });
}