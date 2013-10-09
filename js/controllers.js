var controllers = angular.module('pullme.controllers', ['firebase']);

/*
 * Landing Controller
*/
controllers.controller('LandingCtrl', [
  '$scope',
  'PullsManager',
  '$timeout',
  '$http',

  function($scope, PullsManager, $timeout, $http){
    var pulls = new PullsManager($scope, $scope.auth);
    pulls.getPulls();

    $scope.boarding = {
      wakeboarding: true,
      wakesurfing: true,
      wakeskating: true
    };

    $scope.location = {
      search: null
    }

    $scope.distances = ['5','15','25','50','100','150'];
    $scope.selectedDistance = '25';

    $scope.selectDistance = function(){
      $scope.selectedDistance = this.distance;
    };

    $scope.filterPulls = function(pull){
      var searchTypeFilters = [];
      var pullTypes = [];
      for(key in $scope.boarding){
        if($scope.boarding[key] && $.grep(pull.pulltypes, function(type){return (type.name === key && type.selected)})){
          return _calculateDistance($scope, pull) <= parseInt($scope.selectedDistance);
        } else {
          continue;
        }
      }
    };

    $scope.search = function(){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': $scope.location.search }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $timeout(function(){
            $scope.location.lat = results[0].geometry.location.lat();
            $scope.location.lng = results[0].geometry.location.lng();
          });
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    var _calculateDistance = function($scope, pull){
      if($scope.location.lat && $scope.location.lng){
        var from = new google.maps.LatLng($scope.location.lat, $scope.location.lng),
        to = new google.maps.LatLng(pull.location.lat, pull.location.lng),
        distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(from, to) * 0.000621371192);
        pull.location.distance = distance;
        return distance;
      } else {
        return 0;
      }
    }
  }
]);

/*
 * Session Controller
*/
controllers.controller('SessionCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$timeout',

  function($scope, $rootScope, $modal, $timeout) {
    $scope.loading = false;
    $scope.alerts = [];

    $scope.cred = {
      email: undefined,
      password: undefined
    };

    $scope.signup = function($modal){
      var newUser = $scope.cred;
      $scope.alerts = [];

      if(newUser.email && newUser.password){
        $scope.loading = true;
        $rootScope.signup(newUser);
      } else {
        $scope.alerts.push({title:'Unable to sign up:', content: (!newUser.email ? 'Email' : !newUser.password ? 'Password':'')+' is required.', type:'error'});
      }

      $rootScope.$on('auth.signup.error', function(event, args){
        $timeout(function(){
          $scope.loading = false;
          $scope.alerts.push({content: args.error.message, type:'error'});
        });
      });

      $rootScope.$on('auth.signup.success', function(event, args){
        $timeout(function(){
          $scope.loading = false;
          $modal('hide');
        });
      });
    };

    $scope.login = function($modal){
      $scope.alerts = [];
      var returnUser = $scope.cred;

      if(returnUser.email && returnUser.password){
        $scope.loading = true;
        $rootScope.login('password',returnUser);
      } else {
        $scope.alerts.push({title:'Unable to login:', content: (!returnUser.email ? 'Email' : !returnUser.password ? 'Password':'')+' is required.', type:'error'});
      }

      $rootScope.$on("auth.login", function() {
        $timeout(function(){
          $scope.loading = false;
          $modal('hide');
        });
      });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }
]);

/*
 * New Pull Controller
 */
controllers.controller('PullsNewCtrl', [
  '$scope',
  '$timeout',
  'PullsManager',
  '$location',

  function($scope, $timeout, PullsManager, $location){
    var pulls = new PullsManager($scope, $scope.auth);

    $scope.options = {
      years: function(){
        var currentYear = new Date().getFullYear()+1,
        years = [];
        startYear = 1970;
        while ( startYear <= currentYear ) {
          years.unshift(startYear++);
        }
        return years;
      },
      days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      hours: function(){
        var hours = [],
        startHour = 1,
        endHour = 12;
        while(startHour <= endHour) {
          hours.push(startHour++);
        }
        return hours;
      },
      periods: ['AM','PM']
    };

    $scope.schedules = []

    $scope.addSchedule = function(){
      this.schedules.push(this.schedule);
      this.schedule = undefined;
    };

    $scope.removeSchedule = function(index){
      $scope.schedules.splice(index, 1);
    };

    $scope.pulltypes = [
      {name:'wakeboarding',selected:true},
      {name:'wakesurfing',selected:false},
      {name:'wakeskating',selected:false}
    ];

    $scope.location = {
      city: undefined,
      state: undefined,
      zip_code: undefined,
      verified: undefined,
      lat: undefined,
      lng: undefined
    };

    $scope.$watch('location', function(){
      var location = $scope.location;
      if(location.verified === undefined && typeof location.city === 'string' && typeof location.state === 'string' && typeof location.zip_code === 'string' && location.zip_code.length >= 4){
        $timeout(function(){
          verifyLocation(location);
        }, 1000);
      }
    }, true);

    $scope.selectLocation = function(location){
      $scope.location.lat = location.geometry.location.lat();
      $scope.location.lng = location.geometry.location.lng();
      $scope.location.verified = location.formatted_address;
      $scope.location.city = location.address_components[0].long_name;
      $scope.location.state = location.address_components[2].long_name;
    };

    $scope.submit = function(){
      pulls.addPull();
    };

    $scope.$on('pulls.add.success', function(event, args){
      $timeout(function(){
        $location.path('/pulls/'+args.pull);
      }, 250);
    });

    var verifyLocation = function(location){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': JSON.stringify(location.city)}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.$apply(function(){
            $scope.locations = results;
          });
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
  }
]);

/*
 * View a Pull Controller
 */
controllers.controller('PullsShowCtrl', [
  '$scope',
  '$routeParams',
  'PullsManager',

  function($scope, $routeParams, PullsManager){
    var pulls = new PullsManager($scope, $scope.auth);
    pulls.getPull($routeParams.pullId);

    $scope.request = {
      expenses: undefined,
      help: {
        ridingLessons: false,
        driving: false,
        cleanup: false
      },
      notification: {
        email: false,
        textMessage: false
      },
      user_id: undefined
    };

    $scope.pullRequested = function(){
      if($scope.pull && $scope.pull.requests){
        var userRequestedPull = false;
        for (var key in $scope.pull.requests) {
          var request = $scope.pull.requests[key];
          if(request.user_id === $scope.auth.user) {
            return request;
          }
        }
      }
    };

    $scope.requestPull = function($modal){
        $scope.request.user_id = $scope.auth.user;
        pulls.addRequest($routeParams.pullId);

      $scope.$on('requests.add.success', function(event, args){
        $modal('hide');
      });
    }
  }
]);

/*
 * User Pulls Controller
 */
 controllers.controller('UsersPullsCtrl', [
  '$scope',
  '$routeParams',
  'PullsManager',

  function($scope, $routeParams, PullsManager){
    var pulls = new PullsManager($scope, $scope.auth);
    pulls.getPulls($routeParams.userId);

    $scope.remove = function(id){
      pulls.removePull(id);
    };

    $scope.$watch('pulls',function(value){
      if(value){
        for(key in value){
          pulls.getPull(value[key].id, function(data){
            $scope.$apply(function(){
              $scope.pulls[data.id] = data;
            });
          });
        }
      }
    });
  }
 ]);

 /*
 * User Show Controller
 */
 controllers.controller('UsersShowCtrl', [
  '$scope',
  '$routeParams',
  'PullsManager',
  'ImgurManager',
  'angularFire',
  'FIREBASE_URL',
  '$timeout',
  'SmsManager',

  function($scope, $routeParams, PullsManager, ImgurManager, angularFire, FIREBASE_URL, $timeout, SmsManager){
    $scope.user = angularFire(FIREBASE_URL+'users/'+$routeParams.userId, $scope, 'user', {})
    $scope.options = {
      gear: ['Wakeboard','Wakesurf','Wakeskate','Helmet','Bindings','Camera','Handle','Rope','Fins','Shoes','Vest']
    }

    $scope.addGear = function(){
      if($scope.user.gear === undefined) {
        $scope.user.gear = [];
      }
      $scope.user.gear.push(this.gear);
      this.gear = undefined;
    };

    $scope.removeGear = function(index){
      $scope.user.gear.splice(index,1);
    };

    $scope.verifyCell = function(){
      var Message = new SmsManager();
      if($scope.user.cell.verification){
        

      } else {
        Message.validate($scope.user.cell.value, function(data){
          if(data.valid){
            $timeout(function(){
              $scope.user.cell.value = data.national;
              $scope.user.cell.international = data.international;
              $scope.user.cell.e164 = data.e164.replace('+','');
              $scope.user.cell.verification = Math.floor(Math.random() * 9999);
            });
            $scope.sendVerificationCode();
          }
        });
      }
    };

    $scope.sendVerificationCode = function(){
      if($scope.user.cell.verification){
        var Message = new SmsManager(),
        verifyText = "Your Find A Wake verification code is "+$scope.user.cell.verification;
        Message.send($scope.user.cell.e164, verifyText);
      }
    };


    $scope.upload = function(){
      $scope.uploadingAvatar = true;
      var Imgur = new ImgurManager();
      Imgur.uploadImage($scope.avatar, function(data){
        if(data.status === 200){
          $timeout(function(){
            $scope.uploadingAvatar = false;
            $scope.user.avatar = data.data.link
          });
        } else {
          alert('Unable to save your avatar. Please refresh the page and try again.');
        }
      });
    };
  }
 ]);