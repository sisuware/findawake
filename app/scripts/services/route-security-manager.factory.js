(function(){
  'use strict';

  angular
    .module('findAWake')
    .run(runConfig)
    .factory('RouteSecurityManager', RouteSecurityManager);

  runConfig.$inject = ['RouteSecurityManager'];
  RouteSecurityManager.$inject = ['$location', '$rootScope', 'loginRedirectPath', 'SimpleLogin'];

  function runConfig (RouteSecurityManager) {
    RouteSecurityManager.init();
  }

  function RouteSecurityManager($location, $rootScope, loginRedirectPath, SimpleLogin) {
    var service = {
      init: init
    };

    return service;

    function init() {
      SimpleLogin.init();

      $rootScope.$on('$routeChangeStart', function (event, current, prev) {
        _checkCurrentRoute(current, event);
      });

      SimpleLogin.onAuth(function(auth){
        if (!auth) {
          _handleAuthRequired();
        }
      });
    }

    function _checkCurrentRoute(current, event) {
      
      if(current && current.authRequired) {
        SimpleLogin.currentUser().then(function(auth){
          if (!auth) {
            _handleAuthRequired(event);
          }
        }, _handleAuthRequired.bind(null, event));
      }
    }

    function _handleAuthRequired(event) {
      console.debug('this route requires you to be authenticated.');
      
      if (event) {
        event.preventDefault();
      }

      $location.path(loginRedirectPath).search('redirect', window.location.pathname);
    }
  }
})();