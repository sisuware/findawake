(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('userRequestPanel', userRequestPanel);

    userRequestPanel.$inject = ['Requests','Wakes'];

    function userRequestPanel(Requests, Wakes) {
      var _html  = '<div class="thumbnail" ng-class="{\'color3\':request.accepted,\'color4\':request.declined,\'highlight\':!request.accepted && !request.declined}">';
          _html += '  <div wake-thumbnail wake-id="{{wakeId}}"></div>';
          // _html += '  <a ng-href="/wakes/{{wake.id}}" target="_blank"><img style="rounded" avatar="{{wake.thumbnail}}" /></a>';
          // _html += '   <h4 class="text-center"><a ng-href="/wakes/{{wake.id}}" target="_blank">{{wake.boat.year}} {{wake.boat.make}} {{wake.boat.model}}</a></h4>';
          // _html += '  <div ng-cloak ng-hide="acceptedOrDeclined()" class="caption text-center">';
          // _html += '    <span class="label {{request.expenses ? \'label-success\':\'label-warning\'}}">${{request.expenses || \'0\'}}.<sup>00</sup></span>';
          // _html += '  </div>';
          // _html += '  <div ng-cloak ng-show="request.help" ng-hide="acceptedOrDeclined()" class="caption text-center">';
          // _html += '    <small class="text-muted text-uppercase">you offered to help with</small>';
          // _html += '    <ul class="list-unstyled text-center">';
          // _html += '      <li ng-repeat="(key,value) in request.help" class="text-capitalize text-success">{{key}}</li>';
          // _html += '    </ul>';
          // _html += '  </div>';
          // _html += '  <div ng-cloak ng-show="request.types" ng-hide="acceptedOrDeclined()" class="caption text-center">';
          // _html += '    <small class="text-muted text-uppercase">and will be</small>';
          // _html += '    <ul class="list-unstyled text-center">';
          // _html += '      <li ng-repeat="(key,value) in request.types" class="text-capitalize text-info">{{key}}</li>';
          // _html += '    </ul>';
          // _html += '  </div>';
          _html += '  <div ng-cloak ng-hide="acceptedOrDeclined()" class="caption text-center">';
          // _html += '    <button class="btn btn-sm btn-default highlight" role="button" ng-click=""><i class="fa fa-trash"></i> Delete</button>';
          // _html += '    <button class="btn btn-sm btn-primary" role="button" ng-click="">Edit</button>';
          _html += '    <span class="text-muted inline-block">Request Pending...</span>';
          _html += '  </div>';
          _html += '  <div ng-cloak ng-show="acceptedOrDeclined()" class="caption text-center">';
          _html += '    <span ng-cloak ng-show="request.accepted" class="text-success"><i class="fa fa-smile-o"></i> Request Accepted</span>';
          _html += '    <span ng-cloak ng-show="request.declined" class="text-danger"><i class="fa fa-frown-o"></i> Request Declined</span>';
          _html += '  </div>';
          _html += '</div>';

      var directive = {
       template: _html,
       scope: {
        wakeId: '=',
        requestId: '='
      },
      controller: requestPanelController
    };

    requestPanelController.$inject = ['$scope'];

    return directive;

    function requestPanelController($scope) {
      $scope.acceptedOrDeclined = acceptedOrDeclined;
      
      Requests.get({'wakeId':$scope.wakeId, 'id':$scope.requestId}).then(function(data){
        $scope.request = data;
      });
      // Users.getProfile($scope.request.userId).then(function(data){
      //   $scope.profile = data;
      // });

      function acceptedOrDeclined() {
        if (!$scope.request) { return false; }
        return $scope.request.accepted || $scope.request.declined;
      }
    }
  }
})();