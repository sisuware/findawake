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

	    var invalid = SimpleLogin.assertValidCreateAccountAttempt($scope.email, $scope.password, $scope.confirm);
	    
	    if (invalid) {
	    	$scope.loading = false;
	      $scope.error = invalid;
	      _resetPasswords();
	      return false;
	    }

	    SimpleLogin.createUser($scope.email, $scope.password).then(function(){
	    	console.debug('yay! another user.');
	    	$location.path('/signup/success');		
	    }, function(error){
	    	$scope.loading = false;
				$scope.error = SimpleLogin.parseErrorMessages(error);
	    });
		}

		function _resetPasswords(){
			$scope.password = null;
			$scope.confirm = null;
		}
	}
})();