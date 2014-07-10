'use strict';

var app = angular.module('angularfire.login', ['firebase', 'angularfire.firebase']);

app.run(function(SimpleLogin) {
  SimpleLogin.init();
});

app.factory('SimpleLogin', function(
  $rootScope, 
  $firebaseSimpleLogin, 
  firebaseRef, 
  ProfileCreator, 
  $timeout,
  $q
){
  var auth = null, simpleLoginService = {};

  simpleLoginService.init = function() {
    var dfr = $q.defer();
    auth = $firebaseSimpleLogin(firebaseRef(), function(error, user){
      if(error){
        dfr.reject(error);
      } else {
        dfr.resolve(user);
      }
    });
    return dfr.promise;
  };

  simpleLoginService.currentUser = function(){
    assertAuth();
    return auth.$getCurrentUser();
  };

  simpleLoginService.logout = function() {
    assertAuth();
    auth.$logout();
  };
  
  /**
   * @param {string} provider
   * @param {Function} [callback]
   * @returns {*}
   */
  simpleLoginService.login = function(provider, callback) {
    assertAuth();
    auth.$login(provider, {rememberMe: true}).then(function(user) {
      if( callback ) {
        //todo-bug https://github.com/firebase/angularFire/issues/199
        $timeout(function() {
          callback(null, user);
        });
      }
    }, callback);
  };

  /**
   * @param {string} email
   * @param {string} pass
   * @param {Function} [callback]
   * @returns {*}
   */
  simpleLoginService.loginPassword = function(email, pass, callback) {
    assertAuth();
    auth.$login('password', {
      email: email,
      password: pass,
      rememberMe: true
    }).then(function(user) {
      if( callback ) {
        //todo-bug https://github.com/firebase/angularFire/issues/199
        $timeout(function() {
          callback(null, user);
        });
      }
    }, callback);
  };

  simpleLoginService.changePassword = function(opts) {
    assertAuth();
    var cb = opts.callback || function() {};
    if( !opts.oldpass || !opts.newpass ) {
      $timeout(function(){ cb('Please enter a password'); });
    }
    else if( opts.newpass !== opts.confirm ) {
      $timeout(function() { cb('Passwords do not match'); });
    }
    else {
      auth.$changePassword(opts.email, opts.oldpass, opts.newpass)
        .then(function() { cb(null); }, cb);
    }
  };

  simpleLoginService.createAccount = function(email, pass, callback) {
    assertAuth();
    auth.$createUser(email, pass).then(function(user) { 
      callback(null, user); 
    }, callback);
  };

  simpleLoginService.createProfile = ProfileCreator;

  function assertAuth() {
    if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
  }

  return simpleLoginService;
});

app.factory('ProfileCreator', function(
  firebaseRef, 
  $timeout
) {
  return function(id, email, callback) {
    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    firebaseRef('users/' + id).set({
      email: email, 
      name: firstPartOfEmail(email),
      userId: id
    }, function(err) {
      //err && console.error(err);
      if( callback ) {
        $timeout(function() {
          callback(err);
        });
      }
    });
  };
});