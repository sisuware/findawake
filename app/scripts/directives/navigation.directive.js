(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('navigation', navigation);

  navigation.$inject = ['SimpleLogin'];

  function navigation(SimpleLogin) {
    var _html =  '<div class="container">';
        _html += '  <div class="navbar-header">';
        _html += '    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">';
        _html += '      <span class="sr-only">Toggle navigation</span>';
        _html += '      <span class="icon-bar"></span>';
        _html += '      <span class="icon-bar"></span>';
        _html += '      <span class="icon-bar"></span>';
        _html += '    </button>';
        // _html += '    <a class="navbar-brand" href="/">Find A Wake <small class="label label-info">BETA</small></a>';
        _html += '  </div>';
        _html += '  <div class="collapse navbar-collapse" id="navbar-collapse">';
        _html += '    <ul class="nav navbar-nav animated fadeIn">';
        _html += '      <li ng-repeat="route in routes" ks-active-link active-class="active" active-path="{{route.href}}">';
        _html += '        <a href="{{route.href}}"><i class="fa {{route.icon}}"></i> {{route.label}}</a></li>';
        _html += '      </li>';
        _html += '    </ul>';
        _html += '    <ul class="nav navbar-nav navbar-right animated fadeIn">';      
        _html += '      <li ng-cloak ng-show="user" ks-active-link active-class="active" active-path="/account/wakes"><a ng-href="/account/wakes">My Wakes</a></li>';
        _html += '      <li class="dropdown" ng-cloak ng-show="user">';
        _html += '        <a href="" class="dropdown-toggle" data-toggle="dropdown"><span ng-bind="user.password.email"></span> <span class="caret"></span></a>';
        _html += '        <ul class="dropdown-menu" role="menu">';
        _html += '          <li><a ng-href="/account/edit">My Account</a></li>';
        _html += '          <li><a ng-href="/account/wakes">My Wakes</a></li>';
        _html += '          <li><a ng-href="/account/requests">My Ride Requests</a></li>';
        _html += '          <li class="divider"></li>';
        _html += '          <li><a ng-href="/profile/{{user.uid}}">Public Profile</a></li>';
        _html += '          <li class="divider"></li>';
        _html += '          <li><a href="" ng-click="logout()">Logout</a></li>';
        _html += '        </ul>';
        _html += '      </li>';
        _html += '      <li ng-cloak ng-hide="user" ks-active-link active-class="active" active-path="/login"><a href="/login">Login</a></li>';
        _html += '      <li ng-cloak ng-hide="user" ks-active-link active-class="active" active-path="/signup"><a href="/signup">Signup</a></li>';
        _html += '    </ul>';
        _html += '  </div>';
        _html += '</div>';
    
    var directive = {
      template: _html,
      controller: navigationController
    };

    navigationController.$inject = ['$scope','$element','$attrs'];

    return directive;
    
    function navigationController($scope, $element, $attrs) {
      _checkCurrentUser();
      
      $scope.routes = [
        {href:'/wakes/discover', label:'Find A Wake', icon: 'fa-search'},
        {href:'/wakes/share', label:'Share A Wake', icon: 'fa-plus'},
      ];
      
      $scope.logout = SimpleLogin.logout;

      SimpleLogin.onAuth(function(auth){
        if (auth) {
          _checkCurrentUser();
        } else {
          $scope.user = false;
        }
      });

      function _checkCurrentUser() {
        SimpleLogin.currentUser().then(function(user){
          $scope.user = user;
        });
      }

    }
  }
})();