(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('userRequestPanel', userRequestPanel);

    userRequestPanel.$inject = ['Requests','Wakes'];

    function userRequestPanel(Requests, Wakes) {
      var _html  = '<div class="thumbnail" ng-class="{true:\'color3\',false:\'color4\',undefined:\'highlight\'}[request.accepted]">';
          _html += '  <div wake-thumbnail wake-id="{{wakeId}}"></div>';
          _html += '  <div ng-cloak ng-hide="acceptedOrDeclined()" class="caption text-center">';
          _html += '    <span class="text-muted inline-block">Request Pending...</span>';
          _html += '  </div>';
          _html += '  <div ng-cloak ng-show="acceptedOrDeclined()" class="caption text-center">';
          _html += '    <span ng-cloak ng-show="request.accepted" class="text-success"><i class="fa fa-smile-o"></i> Request Accepted</span>';
          _html += '    <span ng-cloak ng-show="!request.accepted" class="text-danger"><i class="fa fa-frown-o"></i> Request Declined</span>';
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
      
      function acceptedOrDeclined() {
        if (!$scope.request) { return false; }
        return _.isBoolean($scope.request.accepted);
      }
    }
  }
})();