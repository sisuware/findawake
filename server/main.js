var FirebaseTokenGenerator = require('firebase-token-generator');
var Queue = require('firebase-queue');
var Firebase = require('firebase');

var ref = new Firebase('https://findawake.firebaseio.com');

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB');
var token = tokenGenerator.createToken({'uid':'1'}, {'admin': true});

var queue = new Queue(ref.child('queue'), processQueue);
var Meetups = require('./meetups')(ref);

function processQueue(data, progress, resolve, reject) {
  // Read and process task data
  console.log('recieved task');
  
  if (data && data.task === 'meetup') {
    Meetups
      .process(data)
      .then(resolve, reject);
  }
}