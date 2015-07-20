var FirebaseTokenGenerator = require('firebase-token-generator');
var Queue = require('firebase-queue');
var Firebase = require('firebase');
var Log = require('./log');
var config = require('./config');

var ref = new Firebase(config.firebase.account);
var Meetups = require('./tasks/meetups')(ref);
var Accounts = require('./tasks/accounts')(ref);
var Profiles = require('./tasks/profiles')(ref);
var Requests = require('./tasks/requests')(ref);

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator(config.firebase.token);
var token = tokenGenerator.createToken({}, {'admin': true});

ref.authWithCustomToken(token, function(error, authData){
  if (error) {
    Log.error('authentication failed', error);
    return false;
  }

  var queue = new Queue(ref.child('queue'), processQueue);
});

function processQueue(data, progress, resolve, reject) {
  Log.info('recieved a new task', data);
  
  var unknownTask = true; 
  
  if (!data) { 
    Log.error('missing data from the new task');
    return false;
  }
  
  if (data.task === 'meetup') {
    unknownTask = false;
    Meetups
      .process(data)
      .then(resolve, reject);
  }

  if (data.task === 'account') {
    unknownTask = false;
    Accounts
      .process(data)
      .then(resolve, reject);
  }

  if (data.task === 'profile') {
    unknownTask = false;
    Profiles
      .process(data)
      .then(resolve, reject);
  }

  if (data.task === 'request') {
    unknownTask = false;
    Requests
      .process(data)
      .then(resolve, reject);
  }

  if (unknownTask) {
    Log.error('unable to process this task', data);
    reject();
  }
}