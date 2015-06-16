(function(){
  'use strict';

  angular
    .module('angularfire.login', ['firebase', 'angularfire.firebase'])
    .run(angularfireRun)
    .factory('SimpleLogin', SimpleLogin)
    .factory('ProfileCreator', ProfileCreator);

  SimpleLogin.$inject = ['$rootScope', 'firebaseRef', 'ProfileCreator', '$timeout', '$q', '$firebaseAuth'];
  ProfileCreator.$inject = ['firebaseRef', '$q'];

  function angularfireRun(SimpleLogin){
    SimpleLogin.init();
  }

  function SimpleLogin($rootScope, firebaseRef, ProfileCreator, $timeout, $q, $firebaseAuth){
    var _auth = null;

    var service = {
      init: init,
      currentUser: currentUser,
      logout: logout,
      login: login,
      loginPassword: loginPassword,
      changePassword: changePassword,
      createAccount: createAccount,
      createProfile: ProfileCreator,
      parseErrorMessages: parseErrorMessages,
      assertValidLoginAttempt: assertValidLoginAttempt,
      assertValidCreateAccountAttempt: assertValidCreateAccountAttempt
    };

    return service;

    function init() {
      var dfr = $q.defer();
      _auth = $firebaseAuth(firebaseRef(), function(error, user){
        if(error){
          dfr.reject(error);
        } else {
          dfr.resolve(user);
        }
      });
      return dfr.promise;
    }

    function currentUser(){
      _ensureAuth();
      return _auth.$waitForAuth();
    }

    function logout() {
      _ensureAuth();
      return _auth.$unauth();
    }
    
    /**
     * @param {string} provider
     * @param {Function} [callback]
     * @returns {*}
     */
    function login(provider, credentials, callback) {
      _ensureAuth();
      return _auth.$authWithOAuthToken(provider, credentials, {rememberMe: true}).then(function(user) {
        if( callback ) {
          //todo-bug https://github.com/firebase/angularFire/issues/199
          $timeout(function() {
            callback(null, user);
          });
        }
      }, callback);
    }

    /**
     * @param {string} email
     * @param {string} pass
     * @param {Function} [callback]
     * @returns {*}
     */
    function loginPassword(email, pass, callback) {
      _ensureAuth();
      return _auth.$authWithPassword({
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
    }

    function changePassword(user) {
      _ensureAuth();
      var dfr = $q.defer();

      if( !user.oldpass || !user.newpass ) {
        dfr.reject('Please enter a password');
      } else if( user.newpass !== user.confirm ) {
        dfr.reject('Passwords do not match');
      } else {
        _auth.$changePassword({
          'email': user.email, 
          'oldPassword': user.oldpass, 
          'newPassword': user.newpass
        }).then(dfr.resolve, dfr.reject);
      }

      return dfr.promise;
    }

    function createAccount(email, password, callback) {
      _ensureAuth();
      var dfr = $q.defer();

      _auth.$createUser({
        'email': email, 
        'password': password
      }).then(dfr.resolve, dfr.reject);

      return dfr.promise;
    }

    function parseErrorMessages(err){
      if(err){
        return err.message.replace(/FirebaseSimpleLogin:\s/g,'');
      } else {
        return null;
      }
    }

    function assertValidLoginAttempt(email, pass){
      if( !email ) {
        return 'Please enter an email address';
      } else if( !pass ) {
        return 'Please enter a password';
      }
      return false;
    }

    function assertValidCreateAccountAttempt(email, pass, confirm) {
      if( !email ) {
        return 'Please enter an email address';
      } else if( !pass ) {
        return 'Please enter a password';
      } else if( pass !== confirm ) {
        return 'Passwords do not match';
      }
      return false;
    }

    function _ensureAuth() {
      if( _auth === null ) { 
        throw new Error('Must call loginService.init() before using its methods'); 
      }
    }
  }

  function ProfileCreator(firebaseRef, $q) {
    function _firstPartOfEmail(email) {
        return _ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function _ucfirst (str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    return function(id, email) {
      var dfr = $q.defer(),
          ref = firebaseRef('users/' + id);

      var refData = {
        email: email, 
        name: _firstPartOfEmail(email),
        userId: id
      };

      ref.set(refData, function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve(refData);
        }
      });

      return dfr.promise;
    };
  }
})();