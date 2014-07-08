'use strict';

/**
 * @ngdoc overview
 * @name findawakeApp
 * @description
 * # findawakeApp
 *
 * Main module of the application.
 */
var app = angular.module('findawakeApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'firebase',
  'angularfire.firebase',
  'angularfire.login',
  'simpleLoginTools',
  'imgur'
]);


app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html', 
      controller: 'IndexCtrl',
      authRequired: false,
      resolve: {
        auth: function(SimpleLogin){
          return SimpleLogin.currentUser();
        },
        wakes: function(Wakes){
          return Wakes.query();
        }
      }
    })
    .when('/:nick', {
      templateUrl: 'views/users/show.html', 
      controller: 'UsersShowCtrl', 
      authRequired: true
    })
    .when('/my/boats', {
      templateUrl: 'views/users/boats.html', 
      controller: 'UsersPullsCtrl', 
      authRequired: true
    })
    .when('/account/requests', {
      templateUrl: 'views/users/requests.html', 
      controller: 'UsersRequestsCtrl', 
      authRequired: true
    })
    .when('/wakes/new', {
      templateUrl: 'views/wakes/new.html', 
      controller: 'NewWakeCtrl'
    })
    .when('/wakes/:id', {
      templateUrl: 'views/wakes/show.html', 
      controller: 'WakeCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html', 
      controller: 'LoginCtrl',
      authRequired: false
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.constant('angularFireVersion', '0.6')
   .constant('loginRedirectPath', '/login')
   .constant('loginProviders', '')
   .constant('FBURL', 'https://pullme.firebaseio.com')
   .constant('IMGUR', 'https://api.imgur.com/3/');
