pullme.controller('PullsShowCtrl', [
  '$scope',
  '$rootScope',
  '$routeParams',
  '$q',

  function($scope, $timeout, $rootScope, $routeParams, $q){
  	var pullRef = new Firebase('https://pullme.firebaseio.com/pulls/'+$rootScope.pullId);
  	$scope.loading = true;
  	pullRef.on('value', function(snapshot) {
		  if(!$scope.$$phase) {
			  $scope.$apply(function(){
			  	$scope.pull = snapshot.val();
			  	$scope.loading = false;
			  });
			}
		});
  }
]);