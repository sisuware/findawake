(function(){
	'use strict';

	angular
		.module('findAWake')
		.directive('wakePanel', wakePanel);

	wakePanel.$inject = ['Wakes','Requests'];

	function wakePanel(Wakes, Requests) {
		var _html  = '<div class="panel">';
				_html += '	<div class="panel-heading color1a">';
				_html += ' 		<div class="row clearfix">';
				_html += '			<div class="col-md-8">';
				_html += '				<h3 class="panel-title">{{wake.boat.year}} {{wake.boat.make}} {{wake.boat.model}} <small><i class="fa fa-map-marker"></i> {{wake.location.formatted}}</small></h3>';
				_html += '			</div>';
				_html += '			<div class="col-md-4 text-right">';
				_html += '				<a ng-cloak ng-show="authorized()" ng-href="/wakes/{{wake.id}}/delete" class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i> Delete</a>';
				_html += '				<a ng-cloak ng-show="authorized()" ng-href="/wakes/{{wake.id}}/edit" class="btn btn-xs btn-info"><i class="fa fa-pencil"></i> Edit</a>';
				_html += '			</div>';
				_html += '		</div>';
				_html += '	</div>';
				_html += '  <div class="panel-body monochrome">';
				_html += '		Ride Requests';
				_html += '	</div>';
				_html += '	<div class="panel-body highlight wake-show-thumbnail {{wake.thumbnail ? \'has-thumbnail\':\'no-thumbnail\'}}" style="background-image: url(\'http://i.imgur.com/{{wake.thumbnail}}h.jpg\')">';
				_html += '	</div>';
				_html += '	<div class="panel-footer">';
				_html += '		<div class="row">';
				_html += '			<div class="col-sm-4">';
				_html += '				<a ng-href="/wakes/{{wake.id}}/requests" class="btn btn-sm btn-primary"><span class="badge">{{requests.length}}</span> Ride Requests</a>';
				_html += '			</div>';
				_html += '		</div>';
				_html += '	</div>';
				_html += '</div>';
		
		var directive = {
			template: _html,
			scope: {
				wakeId: '=',
				user: '='
			},
			controller: wakePanelController
		};

		wakePanelController.$inject = ['$scope'];

		return directive;

		function wakePanelController($scope) {
			$scope.authorized = isUserAuthorized;

			Wakes.get($scope.wakeId).then(function(data){
				$scope.wake = data;
			});

			Requests.query($scope.wakeId).then(function(data){
				console.log(data);
				$scope.requests = data;
			});


			function isUserAuthorized() {
				return $scope.user && $scope.wake && $scope.user.$id === $scope.wake.userId;
			}
		}
	}
})();