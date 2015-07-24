(function(){
  'use strict';

  angular
    .module('findAWake', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'firebase',
      'ui.bootstrap',
      'imgur',
      'google.geocoder',
      'ks.activeLink'
    ])
    .config(findAWakeConfig)
    .constant('loginRedirectPath', '/login')
    .constant('loginProviders', '')
    .constant('FBURL', 'https://findawake.firebaseio.com');

  findAWakeConfig.$inject = ['$routeProvider', '$locationProvider'];

  function findAWakeConfig($routeProvider, $locationProvider) {
    authResolve.$inject = ['SimpleLogin'];
    wakesResolve.$inject = ['Wakes'];
    authUserResolve.$inject = ['SimpleLogin', 'Users'];
    wakeResolve.$inject = ['Wakes', '$route'];
    wakeRequestsResolve.$inject = ['Requests', '$route'];
    profileResolve.$inject = ['Users', '$route'];
    meetupsResolve.$inject = ['Meetups', '$route'];
    wakesLocationResolve.$inject = ['Locations','$route'];
    hashResolve.$inject = ['Hashes','$route'];

    $locationProvider.html5Mode(true);
    
    function authResolve(SimpleLogin){
      return SimpleLogin.currentUser();
    }

    function wakesResolve(Wakes) {
      return Wakes.query(8);
    }

    function authUserResolve(SimpleLogin, Users){
      return SimpleLogin.currentUser().then(function(user){
        if(user){
          return Users.get(user.uid);
        }
      });
    }

    function wakeResolve(Wakes, $route){
      return Wakes.get($route.current.params.id);
    }

    function wakeRequestsResolve(Requests, $route) {
      return Requests.query($route.current.params.id);
    }

    function profileResolve(Users, $route){
      return Users.getProfile($route.current.params.id);
    }

    function meetupsResolve(Meetups, $route) {
      return Meetups.query($route.current.params.id);
    }

    function wakesLocationResolve(Locations, $route) {
      var id = [$route.current.params.state, $route.current.params.city].join('/');
      return Locations.get(id);
    }

    function hashResolve(Hashes, $route) {
      return Hashes.get($route.current.params.hash);
    }

    function resolveRedirect(params, path, search) {
      if (path.match(/^(\/!)/)) {
        var url = path.replace(/^(\/!)/,'');
        if (search && search.hash) {
          url += '?hash=' search.hash;
        }
        return url;
      } else {
        return '/wakes/discover';
      }
    }

    $routeProvider
      .when('/wakes/discover', {
        templateUrl: '/views/wakes/index.html', 
        controller: 'WakesIndexController',
        authRequired: false,
        resolve: {
          wakes: wakesResolve
        }
      })
      .when('/wakes/share', {
        templateUrl: '/views/wakes/new.html', 
        controller: 'WakesNewController',
        authRequired: true,
        resolve: {
          auth: authResolve
        }
      })
      .when('/wakes/in/:state/:city', {
        templateUrl: '/views/wakes/location_index.html', 
        controller: 'WakesLocationIndexController',
        authRequired: false,
        resolve: {
          wakes: wakesLocationResolve
        }
      })
      .when('/wakes/:id', {
        templateUrl: '/views/wakes/show.html', 
        controller: 'WakesShowController',
        authRequired: false,
        resolve: {
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/edit', {
        templateUrl: '/views/wakes/edit.html', 
        controller: 'WakesEditController',
        authRequired: true,
        authorizationRequired: 'wake.userId',
        resolve: {
          auth: authResolve,
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/delete', {
        templateUrl: '/views/wakes/delete.html', 
        controller: 'WakesDeleteController',
        authRequired: true,
        authorizationRequired: 'wake.userId',
        resolve: {
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/request/ride', {
        templateUrl: '/views/wakes/request.html', 
        controller: 'WakesRequestController',
        authRequired: true,
        resolve: {
          wake: wakeResolve,
          auth: authResolve
        }
      })
      .when('/wakes/:id/meetup', {
        templateUrl: '/views/wakes/ride.html', 
        controller: 'WakesRideController',
        authRequired: true,
        authorizationRequired: 'wake.userId',
        resolve: {
          auth: authResolve,
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/requests', {
        templateUrl: '/views/wakes/requests.html',
        controller: 'WakesRequestsController',
        authRequired: true,
        authorizationRequired: 'wake.userId',
        resolve: {
          auth: authResolve,
          wake: wakeResolve,
          requests: wakeRequestsResolve
        }
      })
      .when('/wakes/:id/meetups', {
        templateUrl: '/views/wakes/meetups.html',
        controller: 'WakesMeetupsIndexController',
        authRequired: true,
        authorizationRequired: 'wake.userId',
        resolve: {
          wake: wakeResolve,
          meetups: meetupsResolve
        }
      })
      .when('/account/wakes', {
        templateUrl: '/views/user/wakes.html',
        controller: 'UsersWakesController',
        authRequired: true,
        authorizationRequired: 'profile.$id',
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/account/requests', {
        templateUrl: '/views/user/requests.html',
        controller: 'UsersRequestsController',
        authRequired: true,
        authorizationRequired: 'profile.$id',
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/account/edit', {
        templateUrl: '/views/user/edit.html', 
        controller: 'UsersEditController', 
        authRequired: true,
        authorizationRequired: 'profile.$id',
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/account/verify/email', {
        templateUrl: '/views/user/verify/email.html',
        controller: 'UsersVerifyEmailController',
        authRequired: true,
        reloadOnSearch: false,
        resolve: {
          profile: authUserResolve
        }
      })  
      .when('/profile/:id', {
        templateUrl: '/views/user/show.html',
        controller: 'ProfileController',
        authRequired: false,
        resolve: {
          profile: profileResolve
        }
      })
      .when('/legal', {
        templateUrl: '/views/legal/index.html', 
        authRequired: false
      })
      .when('/login', {
        templateUrl: '/views/auth/login.html', 
        controller: 'LoginController',
        authRequired: false
      })
      .when('/signup', {
        templateUrl: '/views/auth/signup.html', 
        controller: 'SignupController',
        authRequired: false
      })
      .when('/signup/success', {
        templateUrl: '/views/auth/signup.success.html',
        controller: 'SignupSuccessController',
        authRequired: true,
        resolve: {
          profile: authUserResolve
        }
      })
      .otherwise({
        redirectTo: resolveRedirect
      });
  }

})();