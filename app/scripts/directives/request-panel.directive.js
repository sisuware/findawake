(function(){
	'use strict';

	angular
  .module('findAWake')
  .directive('requestPanel', requestPanel);

  requestPanel.$inject = ['Users', 'Requests'];

  function requestPanel(Users, Requests) {
    var _html  = '<div class="thumbnail" ng-class="{true:\'color3\',false:\'color4\',undefined:\'highlight\'}[request.accepted]">';
        _html += '  <a href="/profile/{{request.userId}}" target="_blank"><img avatar="{{profile.avatar}}" /></a>';
        _html += '   <h4 class="text-center"><a ng-href="/profile/{{request.userId}}" target="_blank">{{profile.name}}</a></h4>';
        _html += '  <div class="caption text-center">';
        _html += '    <span class="label {{request.expenses ? \'label-success\':\'label-warning\'}}">${{request.expenses || \'0\'}}.<sup>00</sup></span>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-show="request.help" ng-hide="acceptedOrDeclined()" class="caption text-center">';
        _html += '    <small class="text-muted text-uppercase">will help with</small>';
        _html += '    <ul class="list-unstyled text-center">';
        _html += '      <li ng-repeat="(key,value) in request.help" class="text-capitalize text-success">{{key}}</li>';
        _html += '    </ul>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-show="request.types" ng-hide="acceptedOrDeclined()" class="caption text-center">';
        _html += '    <small class="text-muted text-uppercase">will be</small>';
        _html += '    <ul class="list-unstyled text-center">';
        _html += '      <li ng-repeat="(key,value) in request.types" class="text-capitalize text-info">{{key}}</li>';
        _html += '    </ul>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-hide="acceptedOrDeclined()" class="caption text-center">';
        _html += '    <button class="btn btn-danger" role="button" ng-click="declineRequest(request)">Decline</button>';
        _html += '    <button class="btn btn-primary" role="button" ng-click="acceptRequest(request)">Accept</button>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-show="acceptedOrDeclined()" class="caption text-center">';
        _html += '    <span ng-cloak ng-show="request.accepted" class="text-success">Request Accepted</span>';
        _html += '    <span ng-cloak ng-show="!request.accepted" class="text-danger">Request Declined</span>';
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
      $scope.acceptedOrDeclined = acceptedOrDeclined;

      Users.getProfile($scope.request.userId).then(function(data){
        $scope.profile = data;
      });

      function acceptedOrDeclined() {
        return _.isBoolean($scope.request.accepted);
      }
    }
  }
})();