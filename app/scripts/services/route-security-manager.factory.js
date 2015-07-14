(function(){
  'use strict';

  angular
    .module('findAWake')
    .run(runConfig)
    .factory('RouteSecurityManager', RouteSecurityManager);

  runConfig.$inject = ['RouteSecurityManager'];
  RouteSecurityManager.$inject = ['$location', '$rootScope', 'loginRedirectPath', 'SimpleLogin', '$q', '$route'];

  function runConfig (RouteSecurityManager) {
    RouteSecurityManager.init();
  }

  function RouteSecurityManager($location, $rootScope, loginRedirectPath, SimpleLogin, $q, $route) {
    var service = {
      init: init
    };

    return service;

    function init() {
      SimpleLogin.init();

      $rootScope.$on('$routeChangeStart', function (event, current, prev) {
        _checkRouteAuthentication(current, event);
      });

      $rootScope.$on('$routeChangeSuccess', function (event, current, prev) {
        _checkRouteAuthorization(current, event);
      });

      SimpleLogin.onAuth(function(auth){
        if (!auth && $route.current.authRequired) {
          _handleAuthenticationRequired();
        }
      });
    }

    function _checkRouteAuthorization(current, event) {
      if (!current || current && !current.authorizationRequired) { return false; }

      SimpleLogin.currentUser().then(function(auth){
        if (!auth) {
          _handleAuthorizationRequired(event);
        } else {
          _unwrapAuthorizationReference(current).then(function(data){
            if (data !== auth.uid) {
              _handleAuthorizationRequired(event);
            }
          });
        }
      }, _handleAuthorizationRequired.bind(null, event));
    }

    function _unwrapAuthorizationReference(current) {
      var dfr = $q.defer();
      var keys = current.authorizationRequired.split('.');
      var ref = current.locals;

      keys.forEach(function(key) {
        ref = ref[key];
      });

      if (ref) {
        dfr.resolve(ref);
      } else {
        dfr.reject(ref);
      }

      return dfr.promise;
    }

    function _checkRouteAuthentication(current, event) {
      if (!current || current && !current.authRequired) { return false; }

      SimpleLogin.currentUser().then(function(auth){
        if (!auth) {
          _handleAuthenticationRequired(event);
        }
      }, _handleAuthenticationRequired.bind(null, event));
    }

    function _handleAuthorizationRequired(event) {
      _preventDefault(event);
      console.debug('this route requires valid authorization.');

      $location.path('/');
    }

    function _handleAuthenticationRequired(event) {
      _preventDefault(event);
      console.debug('this route requires you to be authenticated.');

      $location.path(loginRedirectPath).search('redirect', window.location.pathname);
    }

    function _preventDefault(event) {
      if (!event) { return false; }
      event.preventDefault();
    }
  }
})();