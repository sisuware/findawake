var FirebaseTokenGenerator = require('firebase-token-generator');
var Queue = require('firebase-queue');
var Firebase = require('firebase');

var ref = new Firebase('https://findawake.firebaseio.com');
var Meetups = require('./meetups')(ref);

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB');
var token = tokenGenerator.createToken({}, {'admin': true});

ref.authWithCustomToken(token, function(error, authData){
  if (error) {
    console.log("Authentication Failed!", error);
    return false;
  }

  var queue = new Queue(ref.child('queue'), processQueue);
});




function processQueue(data, progress, resolve, reject) {
  // Read and process task data
  console.log('recieved task');
  
  if (data && data.task === 'meetup') {
    Meetups
      .process(data)
      .then(resolve, reject);
  }
}