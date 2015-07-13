(function(){
  'use strict';

  angular
    .module('findAWake')
    .run(runConfig)
    .factory('RouteSecurityManager', RouteSecurityManager);

  runConfig.$inject = ['RouteSecurityManager'];
  RouteSecurityManager.$inject = ['$location', '$rootScope', '$route', 'loginRedirectPath', 'SimpleLogin'];

  function runConfig (RouteSecurityManager) {
    RouteSecurityManager.init();
  }

  function RouteSecurityManager($location, $rootScope, $route, loginRedirectPath, SimpleLogin) {
    var service = {
      init: init
    };

    return service;

    function init() {
      $rootScope.$on('$routeChangeStart', function (event, current, prev) {
        _checkCurrentRoute(current, event);
      });

      // SimpleLogin.onAuth(function(auth){
        // if (!auth) {
          // _checkCurrentRoute($route);
        // }
      // });
    }

    function _checkCurrentRoute(current, event) {
      
      if(current && current.authRequired) {
        SimpleLogin.currentUser().then(function(auth){
          if (!auth) {
            _handleAuthRequired(current, event);
          }
        }, _handleAuthRequired.bind(null, current, event));
      }
    }

    function _handleAuthRequired(current, event) {
      console.debug('this route requires you to be authenticated.');
      
      if (event) {
        event.preventDefault();
      }

      $location.path(loginRedirectPath).search('redirect', window.location.pathname);
    }
  }

  // function RouteSecurityManager($location, $rootScope, $route, path) {
  //   this._route = $route;
  //   this._location = $location;
  //   this._rootScope = $rootScope;
  //   this._loginPath = path;
  //   this._redirectTo = null;
  //   this._authenticated = !!($rootScope.auth && $rootScope.auth.user);
  //   this._init();
  // }

  // RouteSecurityManager.prototype._init = function () {
  //   var self = this;
  //   this._checkCurrent();

  //   // Set up a handler for all future route changes, so we can check
  //   // if authentication is required.
  //   self._rootScope.$on('$routeChangeStart', function (e, next) {
  //     self._authRequiredRedirect(next, self._loginPath);
  //   });

  //   self._rootScope.$on('$firebaseSimpleLogin:login', angular.bind(this, this._login));
  //   self._rootScope.$on('$firebaseSimpleLogin:logout', angular.bind(this, this._logout));
  //   self._rootScope.$on('$firebaseSimpleLogin:error', angular.bind(this, this._logout));
  // };

  // RouteSecurityManager.prototype._checkCurrent = function () {
  //   // Check if the current page requires authentication.
  //   if (this._route.current) {
  //     this._authRequiredRedirect(this._route.current, this._loginPath);
  //   }
  // };

  // RouteSecurityManager.prototype._login = function () {
  //   this._authenticated = true;
  //   if (this._redirectTo) {
  //     this._redirect(this._redirectTo);
  //     this._redirectTo = null;
  //   }
  //   else if (this._location.path() === this._loginPath) {
  //     this._location.replace();
  //     this._location.path('/');
  //   }
  // };

  // RouteSecurityManager.prototype._logout = function () {
  //   this._authenticated = false;
  //   this._checkCurrent();
  // };

  // RouteSecurityManager.prototype._redirect = function (path) {
  //   this._location.replace();
  //   this._location.path(path);
  // };

  // // A function to check whether the current path requires authentication,
  // // and if so, whether a redirect to a login page is needed.
  // RouteSecurityManager.prototype._authRequiredRedirect = function (route, path) {
  //   if (route.authRequired && !this._authenticated) {
  //     if (route.pathTo === undefined) {
  //       this._redirectTo = this._location.path();
  //     } else {
  //       this._redirectTo = route.pathTo === path ? '/' : route.pathTo;
  //     }
  //     this._redirect(path);
  //   }
  //   else if (this._authenticated && this._location.path() === this._loginPath) {
  //     this._redirect('/');
  //   }
  // };
})();