var FirebaseTokenGenerator = require('firebase-token-generator');
var Firebase = require('firebase');

var ref = new Firebase('https://findawake.firebaseio.com');

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB');
var token = tokenGenerator.createToken({}, {'admin': true});

ref.authWithCustomToken(token, function(error, authData){
  if (error) {
    console.log("Authentication Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});

var Meetups = require('../meetups')(ref);

var task = {
  meetupId: '-JuHX2c--XKn8JFrRBVJ',
  wakeId: '-Ju2pVidXn6wEmzEmDgV',
  task: 'meetup'
}

Meetups.process(task).then(function(results){
  console.log('Testing complete')
  console.log(results);
}, function(errors){
  console.log('Testing failed')
  console.log(errors);
});