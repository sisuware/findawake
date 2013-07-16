pullme.controller('LandingCtrl', [
  '$scope',
  'angularFireCollection',

  function($scope, angularFireCollection){
    var pulls = 'https://pullme.firebaseio.com/pulls';
    $scope.pulls = angularFireCollection(pulls);

    $scope.boarding = {
      wakeboarding: true,
      wakesurfing: true,
      wakeskating: true
    };

    $scope.location = "Portland, Oregon"

    $scope.distances = [
      new Distance({radius:5,name:"5 Miles"}),
      new Distance({radius:15,name:"15 Miles"}),
      new Distance({radius:25,name:"25 Miles"}),
      new Distance({radius:50,name:"50 Miles"}),
      new Distance({radius:100,name:"100 Miles"})
    ];

    $scope.selectedDistance = $scope.distances[0];

    $scope.selectDistance = function(index){};
  }
]);

var Distance = function(args){
	var self = this;
	self.name = args.name;
	self.radius = args.radius;
};