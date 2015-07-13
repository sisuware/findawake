(function(){
	'use strict';

	angular
		.module('findAWake')
		.directive('requestPanel', requestPanel);

	requestPanel.$inject = ['Users', 'Requests'];

	function requestPanel(Users, Requests) {
		var _html  = '<div class="thumbnail highlight">';
    		_html += '  <a href="/profile/{{request.userId}}" target="_blank"><img avatar="{{profile.avatar}}" /></a>';
    		_html += '   <h3 class="text-center"><a ng-href="/profile/{{request.userId}}" target="_blank">{{profile.name}}<a/></h3>';
    		_html += '  <div ng-cloak ng-hide="request.declined" class="caption text-center">';
    		_html += '    <span class="label {{request.expenses ? \'label-success\':\'label-warning\'}}">${{request.expenses || \'0\'}}.<sup>00</sup></span>';
    		_html += '    <hr/>';
    		_html += '    <small class="text-muted text-uppercase">will help with</small>';
    		_html += '    <ul class="list-unstyled text-center">';
    		_html += '      <li ng-repeat="(key,value) in request.help" class="text-capitalize text-success">{{key}}</li>';
    		_html += '    </ul>';
    		_html += '    <hr/>';
    		_html += '    <small class="text-muted text-uppercase">will be</small>';
    		_html += '    <ul class="list-unstyled text-center">';
    		_html += '      <li ng-repeat="(key,value) in request.types" class="text-capitalize text-info">{{key}}</li>';
    		_html += '    </ul>';
    		_html += '    <hr/>';
    		_html += '    <a href="#" class="btn btn-danger" role="button" ng-click="declineRequest(request)">Decline</a> ';
    		_html += '    <a href="#" class="btn btn-primary" role="button" ng-click="acceptRequest(request)">Accept</a>';
    		_html += '  </div>';
    		_html += '</div>';

		var directive = {
			template: _html,
			scope: {
				request: '='
			},
			controller: requestPanelController
		};

		requestPanelController.$inject = ['$scope'];

		return directive;

		function requestPanelController($scope) {
			$scope.declineRequest = Requests.decline;
			$scope.acceptRequest = Requests.accept;

			Users.getProfile($scope.request.userId).then(function(data){
				$scope.profile = data;
			});

		}
	}
})();