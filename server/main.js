var q = require('q');
var FirebaseTokenGenerator = require('firebase-token-generator');
var Request = require('request');
var Queue = require('firebase-queue');
var Firebase = require('firebase');

var emailHook = 'https://zapier.com/hooks/catch/bl3xal';
var ref = new Firebase('https://findawake.firebaseio.com');

// move to env variable
var tokenGenerator = new FirebaseTokenGenerator('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB');
var token = tokenGenerator.createToken({'uid':'1'}, {'admin': true});

var queueRef = ref.child('queue');
var meetupsRef = ref.child('meetups');
var wakesRef = ref.child('wakes');
var acceptedRequestsRef = ref.child('accepted_requests');
var requestsRef = ref.child('requests');
var usersRef = ref.child('users'); 


// ref.authWithCustomToken('YYM6RxwtABV1jlzgIw3wXThPxSKEIM5ufkdrFLZB', function(err, authData){
//     if (err) {
//       console.log("Login failed with error: ", error);
//     } else {
//       console.log("Authenticated successfully with payload: ", authData);
//     }
// });

var queue = new Queue(queueRef, processQueue);

function processQueue(data, progress, resolve, reject) {
  var acceptedRequests, meetup, wake;
  // Read and process task data
  console.log('recieved task');
  
  if (data && data.task === 'meetup') {
    constructMeetupInvitations(data);
  }

  function constructMeetupInvitations(data) {
    var requests = [];
    var dfr = q.defer();
    
    console.log('Meetup: preparing to process');
    console.log(data);

    q
      .all([fetchAcceptedRequests(data), fetchMeetup(data), fetchWake(data)])
      .then(function(values){
        console.log(values);

        
      })

    
      
    // acceptedRequests.forEach(function(requestId){
    //   requests.push(requestsRef.child(data.wakeId).child(requestId).val());
    // });

    // requests.forEach(function(request, index){
    //   if (request.notification.email) {
    //     emailMeetupInvite(request.userId);
    //   }
    //   if (request.notification.text) {
    //     smsMeetupInvite(request.userId);
    //   }

    //   reportProgress(requests.length, index);
    // });

    return dfr.promise;
  }

  function fetchAcceptedRequests(data) {
    var dfr = q.defer();
    acceptedRequestsRef.child(data.wakeId).once("value", function(snapshot){
      if (snapshot) {
        dfr.resolve(snapshot);
      } else {
        dfr.reject();
      }
    });
    return dfr.promise;
  }

  function fetchMeetup(data) {
    var dfr = q.defer();
    meetupsRef.child(data.wakeId).child(data.meetupId).once("value", function(snapshot){
      if (snapshot) {
        dfr.resolve(snapshot);
      } else {
        dfr.reject();
      }
    });
    return dfr.promise;
  }

  function fetchWake(data) {
    var dfr = q.defer();
    wakesRef.child(data.wakeId).once("value", function(snapshot){
      if (snapshot) {
        dfr.resolve(snapshot);
      } else {
        dfr.reject();
      }
    });
    return dfr.promise;
  }

  function reportProgress(total, index) {
    var multiplier = 100 / total;
    var current = (index + 1) * multiplier;
    console.log('Meetup: ' + current + '% processed');

    progress(current).catch(function(error){
      console.log('Meetup: error processing at ' + current + '%');
      console.log(error);

      reject(error);
    });

    if (current === 100) {
      console.log('Meetup: done processing');
      resolve();
    }
  }

  function emailMeetupInvite(userId) {
    console.log('Meetup: Emailing ' + userId);
    var user = usersRef.child(userId).val();
    var data = buildEmailObject(user);
    
    Request.post({url: emailHook, formData: data}, function(error, httpResponse, body){
      if (error) {
        console.log(error);
      }
    });
  }

  function smsMeetupInvite(userId) {
    console.log('Meetup: Texting ' + userId);
  }

  function buildEmailObject(user) {
    var datum = {
      'to': user.email,
      'name': user.name,
      'date': meetup.date,
      'time': meetup.time,
      'location': meetup.location.undefined,
      'address': meetup.location.formatted,
      'wake': parseWakeInfo(wake),
      'wakeHref': generateWakeHref(wake)
    };

    return datum;
  }
}

function parseWakeInfo(wake) {
  return [wake.boat.year, wake.boat.make, wake.boat.model].join(' ');
}

function generateWakeHref(wake) {
  return 'http://findawake/wakes/' + wake.id;
}



