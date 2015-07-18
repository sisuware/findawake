(function(){
	'use strict';

	angular
		.module('findAWake')
		.controller('UsersRequestsController', UsersRequestsController);

	UsersRequestsController.$inject = ['$scope','profile'];

	function UsersRequestsController($scope, profile) {
		$scope.profile = profile;
	}
})();