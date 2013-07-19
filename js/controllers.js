var controllers = angular.module('pullme.controllers', ['firebase']);

/*
 * Landing Controller
*/
controllers.controller('LandingCtrl', [
  '$scope',
  'PullsManager',

  function($scope, PullsManager){
    var pulls = new PullsManager($scope, $scope.auth);
    pulls.getPulls();

    $scope.boarding = {
      wakeboarding: true,
      wakesurfing: true,
      wakeskating: true
    };

    $scope.location = "Portland, Oregon"

    $scope.distances = [
      new _Distance({radius:5,name:"5 Miles"}),
      new _Distance({radius:15,name:"15 Miles"}),
      new _Distance({radius:25,name:"25 Miles"}),
      new _Distance({radius:50,name:"50 Miles"}),
      new _Distance({radius:100,name:"100 Miles"})
    ];

    $scope.selectedDistance = $scope.distances[0];

    $scope.selectDistance = function(index){};
  }
]);

var _Distance = function(args){
  var self = this;
  self.name = args.name;
  self.radius = args.radius;
};

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
  'ImgurManager',

  function($scope, $timeout, PullsManager, $location, ImgurManager){
    var pulls = new PullsManager($scope, $scope.auth);
    var imgur = new ImgurManager($scope, $scope.auth);

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

    /*$scope.boat = {
      year: 'Select one',
      make: undefined,
      model: undefined,
      description: undefined,
      tower: false,
      perfectPass: false,
      ballastSystem: false,
      pylon: false,
      thumbnail: undefined
    };*/

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
 controllers.controller('PullsIndexCtrl', [
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