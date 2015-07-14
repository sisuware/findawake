var Queue = require('firebase-queue');
var Firebase = require('firebase');

var ref = new Firebase('https://findawake.firebaseio.com/queue');

ref.authWithCustomToken('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB', function(err, authData){
    if (err) {
      console.log("Login failed with error: ", error);
    } else {
      console.log("Authenticated successfully with payload: ", authData);
    }
});

var queue = new Queue(ref, processQueue);

function processQueue(data, progress, resolve, reject) {
  // Read and process task data
  console.log(data);
  resolve();
}