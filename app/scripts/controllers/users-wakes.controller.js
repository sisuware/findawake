(function(){
	'use strict';

	angular
		.module('findAWake')
		.controller('UsersWakesController', UsersWakesController);

	UsersWakesController.$inject = ['$scope', '$timeout', 'Users', 'profile'];

	function UsersWakesController($scope, $timeout, Users, profile) {
		$scope.profile = profile;
	}
})();