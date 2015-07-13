(function(){
	'use strict';

	angular
		.module('findAWake')
		.controller('WakesRequestsController', WakesRequestsController);

	WakesRequestsController.$inject = ['$scope', 'auth', 'wake', 'requests'];

	function WakesRequestsController($scope, auth, wake, requests) {
		$scope.wake = wake;
		$scope.auth = auth;
		$scope.requests = requests;
	}
})();