(function(){
	'use strict';

	angular
		.module('findAWake')
		.controller('SignupController', SignupController);

	SignupController.$inject = ['$scope', 'SimpleLogin', '$location'];

	function SignupController($scope, SimpleLogin, $location) {
		$scope.submit = submit;

		function submit() {
			$scope.loading = true;
	    $scope.error = false;

	    var invalid = SimpleLogin.assertValidCreateAccountAttempt($scope.email, $scope.pass, $scope.confirm);
	    
	    if (invalid) {
	      $scope.error = invalid;
	      _resetPasswords();
	      return false;
	    }

	    SimpleLogin.createAccount($scope.email, $scope.pass, _handleCreateAccount);
		}

		function _handleCreateAccount(error) {
			$scope.loading = false;
			
			if (error) {
				$scope.error = SimpleLogin.parseErrorMessages(error);
				return false;
			}

			$location.path('/signup/success');	
		}

		function _resetPasswords(){
			$scope.pass = null;
			$scope.confirm = null;
		}
	}
})();