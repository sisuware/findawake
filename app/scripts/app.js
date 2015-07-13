(function(){
  'use strict';

/**
 * @ngdoc overview
 * @name findawakeApp
 * @description
 * # findawakeApp
 *
 * Main module of the application.
 */
  angular
    .module('findAWake', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'firebase',
      'ui.bootstrap',
      'imgur',
      'geolocation',
      'google.geocoder',
      'ks.activeLink'
    ])
    .config(findAWakeConfig)
    .constant('angularFireVersion', '1.1.1')
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

    $locationProvider.html5Mode(true);
    
    function authResolve(SimpleLogin){
      return SimpleLogin.currentUser();
    }

    function wakesResolve(Wakes) {
      return Wakes.query();
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

    $routeProvider
      .when('/wakes/find', {
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
      .when('/wakes/:id', {
        templateUrl: '/views/wakes/show.html', 
        controller: 'WakesShowController',
        authRequired: false,
        resolve: {
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/ride', {
        templateUrl: '/views/wakes/ride.html', 
        controller: 'WakesRideController',
        authRequired: true,
        resolve: {
          wake: wakeResolve,
          auth: authResolve
        }
      })
      .when('/wakes/:id/edit', {
        templateUrl: '/views/wakes/edit.html', 
        controller: 'WakesEditController',
        authRequired: true,
        resolve: {
          auth: authResolve,
          wake: wakeResolve
        }
      })
      .when('/wakes/:id/requests', {
        templateUrl: '/views/wakes/requests.html',
        controller: 'WakesRequestsController',
        authRequired: true,
        resolve: {
          auth: authResolve,
          wake: wakeResolve,
          requests: wakeRequestsResolve
        }
      })
      .when('/account/:id/wakes', {
        templateUrl: '/views/user/wakes.html',
        controller: 'UsersWakesController',
        authRequired: true,
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/account/:id/requests', {
        templateUrl: '/views/user/requests.html',
        controller: 'UsersRequestsController',
        authRequired: true,
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/account/:id/edit', {
        templateUrl: '/views/user/edit.html', 
        controller: 'UsersEditController', 
        authRequired: true,
        resolve: {
          profile: authUserResolve
        }
      })
      .when('/profile/:id', {
        templateUrl: '/views/user/show.html',
        controller: 'ProfileCtrl',
        authRequired: false,
        resolve: {
          profile: profileResolve,
          auth: authResolve
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
          auth: authResolve
        }
      })
      .when('/welcome', {
        templateUrl: '/views/user/welcome.html', 
        controller: 'UserWelcomeCtrl', 
        authRequired: true,
        resolve: {
          profile: authUserResolve
        }
      })
      .otherwise({
        redirectTo: '/wakes/find'
      });
  }

})();