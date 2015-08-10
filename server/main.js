var Q = require('q');
var FirebaseTokenGenerator = require('firebase-token-generator');
var Queue = require('firebase-queue');
var Firebase = require('firebase');
var Log = require('./log');
var config = require('./config');

var ref = new Firebase(config.firebase.account);

var Specs = require('./specs')(ref);

var tokenGenerator = new FirebaseTokenGenerator(config.firebase.token);
var token = tokenGenerator.createToken({}, {'admin': true});

var queues = [];

_authenticate();

ref.onAuth(function(authData){
  if (authData) {
    if (!queues.length) {
      _startQueues();
    }
  } else {
    if (queues.length) {
      _shutdownQueues();
    }
    _authenticate();
  }
});

function _authenticate() {
  var dfr = Q.defer();

  ref.authWithCustomToken(token, function(error, authData){
    if (error) {
      Log.error('authentication failed', error);
      dfr.reject(error);
    } else {
      dfr.resolve(authData);
    }
  });

  return dfr.promise;
}

function _shutdownQueues() {
  Log.info('queue shutdown');
  var dfr = Q.defer();
  var promises = [];
  
  queues.forEach(function(queue){
    promises.push(queue.shutdown());
  });

  Q.all(promises)
    .then(function(){
      queues = [];
      dfr.resolve();
    }, dfr.reject);

  return dfr.promise;
}

function _startQueues(){
  var specs = Specs.query;
  Log.info('starting queues: ', specs);

  specs.forEach(function(spec){
    var queue = new Queue(ref.child('queue'), { 'specId': spec }, Specs[spec]);
    queues.push(queue);
  });
}

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

process.on('SIGINT', function() {
  _shutdownQueues().then(function() {
    process.exit(0);
  });
});