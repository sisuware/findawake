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
        _html += '    <!-- <a class="navbar-brand" href="/">Find A Wake <small class="label label-info">BETA</small></a> -->';
        _html += '  </div>';
        _html += '  <div class="collapse navbar-collapse" id="navbar-collapse">';
        _html += '    <ul class="nav navbar-nav navbar-right animated fadeIn">';
        _html += '      <li><a href="/wakes" class="">Wakes</a></li>';
        _html += '      <li><a href="/wakes/new" class=""><i class="fa fa-plus"></i> Wake</a></li>';
        _html += '      <li class="dropdown" ng-cloak ng-show="user">';
        _html += '        <a href="" class="dropdown-toggle" data-toggle="dropdown"><span ng-bind="user.password.email"></span> <span class="caret"></span></a>';
        _html += '        <ul class="dropdown-menu" role="menu">';
        _html += '          <li><a ng-href="/profile/{{user.uid}}">My Profile</a></li>';
        _html += '          <li><a ng-href="/profile/{{user.uid}}/edit">My Account</a></li>';
        _html += '          <li class="divider"></li>';
        _html += '          <li><a href="" ng-click="logout()">Logout</a></li>';
        _html += '        </ul>';
        _html += '      </li>';
        _html += '      <li ng-cloak ng-hide="user"><a href="/login">Login</a></li>';
        _html += '      <li ng-cloak ng-hide="user"><a href="/signup">Signup</a></li>';
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
      
      $scope.logout = SimpleLogin.logout;

      SimpleLogin.onAuth(function(auth){
        console.log(auth, $scope.user);

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