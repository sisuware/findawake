var FirebaseTokenGenerator = require('firebase-token-generator');
var Queue = require('firebase-queue');
var Firebase = require('firebase');
var Log = require('./log');
var config = require('./config');

var ref = new Firebase(config.firebase.account);
var Meetups = require('./meetups')(ref);
var Accounts = require('./accounts')(ref);

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
  
  if (!data) { 
    Log.error('missing data from the new task');
    return false;
  }
  
  if (data.task === 'meetup') {
    Meetups
      .process(data)
      .then(resolve, reject);
  }

  if (data.task === 'newAccount') {
    Accounts
      .process(data)
      .then(resolve, reject);
  }
}