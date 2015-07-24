(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('wakeRequestRide', wakeRequestRide);

  wakeRequestRide.$inject = ['Users', 'SimpleLogin', 'Requests'];

  function wakeRequestRide(Users, SimpleLogin, Requests) {
    var _html  = '<h2 ng-cloak ng-show="wake.id" ng-hide="isRequested()">';
        _html += '  <a class="btn btn-block btn-default highlight btn-lg" ng-href="/wakes/{{wake.id}}/request/ride">Request A Ride</a>';
        _html += '</h2>';
        _html += '<h2 ng-cloak ng-show="isRequested()">';
        _html += '  <a ng-cloak ng-hide="acceptedOrDeclined()" class="btn btn-block btn-default highlight btn-lg active" disabled="disabled" href="">Request pending...</a>';
        _html += '  <a ng-cloak ng-show="acceptedOrDeclined() && request.accepted" class="btn btn-block btn-default color3 btn-lg active" disabled="disabled" href=""><i class="fa fa-smile-o"></i> Request Accepted</a>';
        _html += '  <a ng-cloak ng-show="acceptedOrDeclined() && !request.accepted" class="btn btn-block btn-default color4 btn-lg active" disabled="disabled" href=""><i class="fa fa-frown-o"></i> Request Declined</a>';
        _html += '</h2>';
    
    var directive = {
      template: _html,
      controller: wakeRequestRideController
    };

    wakeRequestRideController.$inject = ['$scope'];

    return directive;

    function wakeRequestRideController($scope) {
      $scope.isRequested = isRequested;
      $scope.acceptedOrDeclined = acceptedOrDeclined;

      function currentUser() {
        return SimpleLogin.currentUser();
      }

      function currentUserRequests(user) {
        if (user && $scope.wake && $scope.wake.id) {
          return Users.requests(user.uid, $scope.wake.id);
        }
      }

      function wakeRequest(request) {
        if (request && request.$value) {
          Requests.get({'wakeId':request.$id,'id':request.$value}).then(function(data){
            $scope.request = data;
          });
        }
      }

      function isRequested() {
        if (!$scope.request) { return false; }
        return true;
      }

      function acceptedOrDeclined() {
        if (!$scope.request) {return false;}
        return _.isBoolean($scope.request.accepted);
      }

      currentUser()
        .then(currentUserRequests)
        .then(wakeRequest);

    }
  }
})();
