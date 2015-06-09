(function(){
	'use strict';

	angular
		.module('findAWake')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$scope', 'SimpleLogin', 'Users', '$location', '$window'];

	function RegisterController($scope, SimpleLogin, Users, $location, $window) {
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

			_createProfile();

		}

		function _createProfile() {
			$scope.creatingProfile = true;
			
			SimpleLogin.loginPassword($scope.email, $scope.pass, function(error, user) {
				if (error) {
					$scope.creatingProfile = false;
					$scope.error = error;
					return false;
				}

				SimpleLogin.createProfile(user.id, user.email).then(function(user) {
          Users.createPublicProfile(user).then(function(){
            $location.path('/welcome');
          });
        });
			});
		}

		function _resetPasswords(){
			$scope.pass = null;
			$scope.confirm = null;
		}
	}
})();