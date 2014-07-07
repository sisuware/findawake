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
  //'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'firebase'
]);


app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html', 
      controller: 'IndexCtrl'
    })
    //.when('/users/:userId', {
    //  templateUrl: 'views/users/show.html', 
    //  controller: 'UsersShowCtrl', 
    //  authRequired: true
    //})
    //.when('/users/:userId/pulls', {
    //  templateUrl: 'views/users/pulls.html', 
    //  controller: 'UsersPullsCtrl', 
    //  authRequired: true
    //})
    //.when('/users/:userId/requests', {
    //  templateUrl: 'views/users/requests.html', 
    //  controller: 'UsersRequestsCtrl', 
    //  authRequired: true
    //})
    //.when('/pulls/new', {
    //  templateUrl: 'views/pulls/new.html', 
    //  controller: 'PullsNewCtrl'
    //})
    //.when('/pulls/:pullId', {
    //  templateUrl: 'views/pulls/show.html', 
    //  controller: 'PullsShowCtrl'
    //})
    .otherwise({
      redirectTo: '/'
    });
});
