(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('profileGear', profileGear);

  profileGear.$inject = ['Users'];

  function profileGear(Users) {
    var _gearTypes = ['Wakeboard','Wakesurf','Wakeskate','Helmet','Bindings','Camera','Handle','Rope','Fins','Shoes','Vest'];

    var _html  = '<div class="row">';
        _html += '  <div class="col-sm-6">';
        _html += '    <h4>Your Gear</h4>';
        _html += '  </div>';
        _html += '  <div class="col-sm-6 text-right">';
        _html += '    <button ng-cloak ng-show="dirty" ng-click="updateGear()" ng-disabled="saving" class="btn btn-sm btn-success">';
        _html += '      <span ng-bind="saving ? \'Updating...\':\'Update Gear\'"></span>'; 
        _html += '      <i ng-cloak ng-show="saving" class="fa fa-spin fa-spinner"></i>';
        _html += '    </button>';
        _html += '  </div>';
        _html += '</div>';
        _html += '<table class="table table-condensed table-hover table-list">';
        _html += '  <tbody>';
        _html += '    <tr ng-repeat="gear in profile.gear">';
        _html += '      <td><b>{{gear.type}}</b></td>';
        _html += '      <td>{{gear.desc}}</td>';
        _html += '      <td class="text-right">';
        _html += '        <button ng-click="removeGear($index)" type="button" ng-disabled="saving" class="btn btn-sm btn-default"><i class="fa fa-trash-o"></i></button>';
        _html += '      </td>';
        _html += '    </tr>';
        _html += '    <tr ng-hide="saving" ng-form="gearForm">';
        _html += '      <td>';
        _html += '        <select class="form-control input-sm" name="type" ng-model="newGear.type" ng-options="type as type for type in gearTypes" required></select>';
        _html += '      </td>';
        _html += '      <td>';
        _html += '        <input class="form-control input-sm" name="desc" ng-model="newGear.desc" type="text" placeholder="E.g. Ronix One 2013" required/>';
        _html += '      </td>';
        _html += '      <td class="text-right">';
        _html += '        <button class="btn btn-primary btn-sm" ng-click="addGear(newGear)" ng-disabled="gearForm.$invalid || saving"><i class="fa fa-plus"></i></button>';
        _html += '      </td>';
        _html += '    </tr>';
        _html += '  </tbody>';
        _html += '</table>';

    var directive = {
      template: _html,
      controller: profileGearController,
      scope: {
        profile: '='
      }
    };

    profileGearController.$inject = ['$scope', '$element', '$attrs'];

    return directive;

    function profileGearController($scope, $element, $attrs) {
      $scope.gearTypes = _gearTypes;
      $scope.addGear = addGear;
      $scope.removeGear = removeGear;
      $scope.updateGear = updateGear;

      $scope.dirty = false;

      function updateGear() {
        $scope.saving = true;
        $scope.profile.$save().then(function(){
          Users.updatePublicProfile($scope.profile);
        }, function(res){
          console.debug('unable to update gear: ', res);
        }).finally(function(){
          $scope.saving = false;
          $scope.dirty = false;
        });
      }

      function addGear(gear){
        if (!gear) { return false; }
        $scope.dirty = true;

        if ($scope.profile && !$scope.profile.gear) {
          $scope.profile.gear = [];
        }

        $scope.profile.gear.push(angular.copy(gear));
        _resetNewGear();
      }

      function removeGear(index){
        $scope.dirty = true;
        $scope.profile.gear.splice(index,1);
      }

      function _resetNewGear() {
        $scope.newGear = {};
      }
    }
  }
})();