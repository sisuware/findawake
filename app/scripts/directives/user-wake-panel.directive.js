(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('userWakePanel', userWakePanel);

    userWakePanel.$inject = ['Requests','Meetups'];

    function userWakePanel(Requests, Meetups) {
      var _html  = '<div class="thumbnail">';
          _html += '  <div wake-thumbnail wake-id="{{wakeId}}"></div>';
          _html += '  <div class="caption">';
          _html += '    <div class="row form-group">';
          _html += '      <div class="col-xs-8">';
          _html += '        Riders';
          _html += '      </div>';
          _html += '      <div class="col-xs-4 text-right">';
          _html += '        <a ng-href="/wakes/{{wakeId}}/requests" class="btn btn-default highlight btn-xs"><i class="fa fa-users"></i> {{requests.length}}</a>';
          _html += '      </div>';
          _html += '    </div>';
          _html += '    <div class="row">';
          _html += '      <div class="col-xs-8">';
          _html += '        Meetups';
          _html += '      </div>';
          _html += '      <div class="col-xs-4 text-right">';
          _html += '        <a ng-href="/meetups/{{wakeId}}" class="btn btn-default highlight btn-xs"><i class="fa fa-calendar"></i> {{meetups.length}}</a>';
          _html += '      </div>';
          _html += '    </div>';
          _html += '    <hr/>';
          _html += '    <div class="row">';
          _html += '      <div class="col-xs-6">';
          _html += '        <a ng-href="/wakes/{{wake.id}}/delete" class="btn btn-sm btn-info"><i class="fa fa-trash-o"></i> Delete</a>';
          _html += '      </div>';
          _html += '      <div class="col-xs-6 text-right">';
          _html += '        <a ng-href="/wakes/{{wake.id}}/edit" class="btn btn-sm btn-default highlight"><i class="fa fa-pencil"></i> Edit</a>';
          _html += '      </div>';
          _html += '    </div>';
          // _html += '    <span ng-cloak ng-show="request.accepted" class="text-success"><i class="fa fa-smile-o"></i> Request Accepted</span>';
          // _html += '    <span ng-cloak ng-show="request.declined" class="text-danger"><i class="fa fa-frown-o"></i> Request Declined</span>';
          _html += '  </div>';
          _html += '</div>';

      var directive = {
       template: _html,
       scope: {
        wakeId: '='
      },
      controller: wakePanelController
    };

    wakePanelController.$inject = ['$scope'];

    return directive;

    function wakePanelController($scope) {
      
      Requests.query($scope.wakeId).then(function(data){
        $scope.requests = data;
      });

      Meetups.query($scope.wakeId).then(function(data){
        $scope.meetups = data;
      });
    }
  }
})();