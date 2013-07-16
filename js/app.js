var pullme = angular.module('pullme', ['firebase','$strap.directives']);

pullme.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  //.when('/locations', {templateUrl: 'partials/location-list.html', controller: LocationListCtrl})
  //.when('/locations/:locationId', {templateUrl: 'partials/location-detail.html', controller: LocationDetailCtrl})
  //.when('/boats/', {templateUrl: 'partials/boat-list.html', controller: BoatListCtrl})
  //.when('/boats/:boatId', {templateUrl: 'partials/boat-detail.html', controller: BoatDetailCtrl})
  //.when('/riders/:riderId', {templateUrl: 'partials/riders-detail.html', controller: RiderDetailCtrl})
  .when('/pulls/new', {templateUrl: 'partials/pulls/new.html', controller: 'PullsNewCtrl'})
  .when('/pulls/:pullId', {templateUrl: 'partials/pulls/show.html', controller: 'PullsShowCtrl'})
  .otherwise({redirectTo: '/', templateUrl: 'partials/landing.html', controller: 'LandingCtrl'});
}]);