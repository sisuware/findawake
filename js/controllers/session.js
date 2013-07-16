pullme.controller('SessionCtrl', [
	'$scope',
	'angularFire',
	'$rootScope',
	'AuthService',
	'$modal',

	function($scope, angularFire, $rootScope, AuthService, $modal) {

		$scope.isLoggedIn = false;
		$scope.loading = false;
		$scope.alerts = [];
    	$scope.cred = {
			email: undefined,
			password: undefined
		};


		$scope.signup = function($modal){
			var newUser = $scope.cred;
			if(newUser.email && newUser.password){
				$scope.loading = true;
				AuthService.auth.createUser(newUser.email, newUser.password, function(error, user){
					$scope.$apply(function(){
						if(error){
			        $scope.loading = false;
			        $scope.alerts.push({content: error.message, type:'error'});
						}
						if(user){
			        $modal('hide');
			        $scope.loading = false;
			        console.log(user);
						}
					});
				});
			}
		};

		$scope.login = function($modal){
			var returnUser = $scope.cred;
			if(returnUser.email && returnUser.password){
				$scope.loading = true;
				AuthService.auth.login('password', {
          email: returnUser.email,
          password: returnUser.password
        });
        $rootScope.$on("login", function() {
        	$modal('hide');
        });
			}
		};

		$scope.signout = function(){
			AuthService.auth.logout();
		};

		$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};

    $rootScope.$on("login", function(event, user) {
      $scope.$apply(function(){
        $scope.isLoggedIn = true;
        $scope.loading = false;
        $scope.user = user;
        console.log(user);
      });
    });
    $rootScope.$on("loginError", function(event, error) {
        console.log(error);
        $scope.$apply(function(){
        	$scope.loading = false;
        	$scope.alerts.push({content: error.message, type:'error'});
        });
    });
    $rootScope.$on("logout", function(event) {
        $scope.isLoggedIn = false;
    });
  }
]);