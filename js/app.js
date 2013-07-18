(function() {

	var dependencies = ['firebase', '$strap.directives'];
    var components = ['pullme.config', 'pullme.services','pullme.controllers'];

	angular.module('pullme', dependencies.concat(components))
	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider
	  .when('/users/:userId', {templateUrl: 'partials/users/show.html', controller: 'UsersShowCtrl', authRequired: true,})
	  .when('/users/:userId/pulls', {templateUrl: 'partials/pulls/index.html', controller: 'PullsIndexCtrl', authRequired: true,})
	  .when('/pulls/new', {templateUrl: 'partials/pulls/new.html', controller: 'PullsNewCtrl'})
	  .when('/pulls/:pullId', {templateUrl: 'partials/pulls/show.html', controller: 'PullsShowCtrl'})
	  .otherwise({redirectTo: '/', templateUrl: 'partials/landing.html', controller: 'LandingCtrl'});
	}])
	.run([
		'$rootScope',
		'$location',
		'firebaseAuth',

		function($rootScope, $location, firebaseAuth) {
			firebaseAuth();

			//todo make this a service?
			$rootScope.$on("$routeChangeStart", function (event, next, current) {
		  	if(next.authRequired && !$rootScope.auth.authenticated) {
		    	$location.path('/');
		  	}
			});
		}
	]);

	angular.module('pullme.config', [])
	.constant('version', '0.1')
	.constant('FIREBASE_URL', 'https://pullme.firebaseio.com/');
})();