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
  'ui.bootstrap',
  'angularfire.firebase',
  'angularfire.login',
  'simpleLoginTools',
  'imgur',
  'geolocation',
  'google.geocoder'
]);


app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/views/index.html', 
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
    .when('/wakes/new', {
      templateUrl: '/views/wakes/new.html', 
      controller: 'NewWakeCtrl',
      authRequired: false,
      resolve: {
        auth: function(SimpleLogin){
          return SimpleLogin.currentUser();
        }
      }
    })
    .when('/wakes/:id', {
      templateUrl: '/views/wakes/show.html', 
      controller: 'WakeCtrl',
      authRequired: false,
      resolve: {
        auth: function(SimpleLogin, Users){
          return SimpleLogin.currentUser().then(function(user){
            if(user){
              return Users.get(user.id);
            }
          });
        },
        wake: function(Wakes, $route){
          return Wakes.get($route.current.params.id);
        }
      }
    })
    .when('/wakes/:id/edit', {
      templateUrl: '/views/wakes/edit.html', 
      controller: 'EditWakeCtrl',
      authRequired: true,
      resolve: {
        auth: function(SimpleLogin){
          return SimpleLogin.currentUser();
        },
        wake: function(Wakes, $route){
          return Wakes.get($route.current.params.id);
        }
      }
    })
    .when('/my/account', {
      templateUrl: '/views/user/show.html', 
      controller: 'UserCtrl', 
      authRequired: true,
      resolve: {
        profile: function(SimpleLogin, Users){
          return SimpleLogin.currentUser().then(function(user){
            if(user){
              return Users.get(user.id);
            }
          });
        }
      }
    })
    .when('/profile/:id', {
      templateUrl: '/views/user/profile.html',
      controller: 'ProfileCtrl',
      authRequired: false,
      resolve: {
        profile: function(Users, $route){
          return Users.getProfile($route.current.params.id);
        },
        auth: function(SimpleLogin){
          return SimpleLogin.currentUser();
        }
      }
    })
    .when('/login', {
      templateUrl: '/views/login.html', 
      controller: 'LoginCtrl',
      authRequired: false
    })
    .when('/welcome', {
      templateUrl: '/views/user/welcome.html', 
      controller: 'UserWelcomeCtrl', 
      authRequired: true,
      resolve: {
        profile: function(SimpleLogin, Users){
          return SimpleLogin.currentUser().then(function(user){
            if(user){
              return Users.get(user.id);
            }
          });
        }
      }
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.constant('angularFireVersion', '0.7.1')
   .constant('loginRedirectPath', '/login')
   .constant('loginProviders', '')
   .constant('FBURL', 'https://findawake.firebaseio.com')
   .constant('IMGUR', 'https://api.imgur.com/3/');
