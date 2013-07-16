pullme.controller('PullsNewCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',

  function($scope, $timeout, $rootScope){
  	var pullsRef = new Firebase('https://pullme.firebaseio.com/pulls');

  	$rootScope.$on("login", function(event, user) {
      $scope.$apply(function(){
        $scope.user = user;
      });
    });

  	$scope.options = {
  		years: function(){
	  		var currentYear = new Date().getFullYear(),
	  		years = [];
	      startYear = 1980;
	      while ( startYear <= currentYear ) {
	        years.unshift(startYear++);
	      }
	      return years;
	  	}
	  };

  	$scope.boat = {
  		year: 'Select one',
  		make: undefined,
  		model: undefined,
  		description: undefined,
  		tower: false,
  		perfectPass: false,
  		ballastSystem: false
  	};

  	$scope.schedule = {
  		days:[
  			{name:"Sun",selected:false},
  			{name:"Mon",selected:false},
  			{name:"Tue",selected:false},
  			{name:"Wed",selected:false},
  			{name:"Thur",selected:false},
  			{name:"Fri",selected:false},
  			{name:"Sat",selected:false}
  		],
  		periods:[
  			{name:"AM",selected:false},
  			{name:"PM",selected:false}
  		]
  	};

  	$scope.pulltypes = [
  		{name:'wakeboarding',selected:true},
  		{name:'wakesurfing',selected:false},
  		{name:'wakeskating',selected:false}
  	];

  	$scope.location = {
  		city: undefined,
  		state: undefined,
  		zip_code: undefined,
  		verified: undefined
  	};

  	$scope.$watch('location', function(){
			var location = $scope.location;
			if(typeof location.city === 'string' && typeof location.state === 'string' && typeof location.zip_code === 'string' && location.zip_code.length >= 4){
				$timeout(function(){
					verifyLocation(location);
				}, 1000);
			}
  	}, true);

  	$scope.submit = function(){
  		var newPullRef = pullsRef.push();
  		
  		var data = {
  			id: newPullRef.name(),
  			boat: $scope.boat,
  			schedule: $scope.schedule,
  			pulltypes: $scope.pulltypes,
  			location: $scope.location,
  			user_id: $scope.user.id
  		};

  		newPullRef.set(JSON.parse(angular.toJson(data)), function(error){
  			if(error){
  				console.log(error);
  			} else {
  				console.log(newPullRef.name());
  			}
  		});
  	};

  	var verifyLocation = function(location){
  		var geocoder = new google.maps.Geocoder();
  		geocoder.geocode( { 'address': JSON.stringify(location.city)}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		 			$scope.$apply(function(){
		 				$scope.locations = results;
		 			});
		    } else {
		      console.log('Geocode was not successful for the following reason: ' + status);
		    }
		  });
  	};

  	var throwSubmitError = function(error){
  		console.log(error);
  		return false;
  	};
  }
]);