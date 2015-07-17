(function(){
  'use strict';

  angular
    .module('findAWake')
    .run(angularfireRun)
    .factory('SimpleLogin', SimpleLogin);

  SimpleLogin.$inject = ['$rootScope', 'firebaseRef', '$timeout', '$q', '$firebaseAuth'];

  function angularfireRun(SimpleLogin){
    SimpleLogin.init();
  }

  function SimpleLogin($rootScope, firebaseRef, $timeout, $q, $firebaseAuth){
    var _auth = null;

    var service = {
      init: init,
      currentUser: currentUser,
      onAuth: onAuth,
      logout: logout,
      login: login,
      loginPassword: loginPassword,
      changePassword: changePassword,
      createUser: createUser,
      parseErrorMessages: parseErrorMessages,
      assertValidLoginAttempt: assertValidLoginAttempt,
      assertValidCreateAccountAttempt: assertValidCreateAccountAttempt
    };

    return service;

    function init() {
      var dfr = $q.defer();
      
      if (_auth) { 
        dfr.resolve(_auth);
      } else {
        _auth = $firebaseAuth(firebaseRef(), function(error, user){
          if(error){
            dfr.reject(error);
          } else {
            dfr.resolve(user);
          }
        });
      }
      return dfr.promise;
    }

    function currentUser() {
      _ensureAuth();
      return _auth.$waitForAuth();
    }

    function onAuth(callback) {
      _ensureAuth();
      return _auth.$onAuth(callback);
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
      });
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

    function createUser(email, password) {
      _ensureAuth();
      var dfr = $q.defer();

      _auth.$createUser({
        'email': email, 
        'password': password
      }).then(function successCreateAccount(user) {
        loginPassword(email, password).then(function(user){
          createAccount(user).then(dfr.resolve, dfr.reject);
        }, function(error){
          dfr.reject(error);
        });

      }, function failedCreateAccount(error){
        dfr.reject(parseErrorMessages(error));
      });

      return dfr.promise;
    }

    function createAccount(user) {
      var dfr = $q.defer();
      var users = firebaseRef('users/' + user.uid);

      var datum = {
        userId: user.uid,
        emailVerified: false,
        created: Date.now()
      };

      if (user.password) {
        datum.email = user.password.email;
        datum.name = _extractNameFromEmail(user.password.email);
      }

      users.set(datum, function(err){
        if(err){
          dfr.reject(err);
        } else {
          createTask({'task':'newAccount','userId':user.uid}).then(dfr.resolve,dfr.reject);
        }
      });

      return dfr.promise;
    }

    function createTask(task) {
      var dfr = $q.defer();
      var ref = firebaseRef('/queue/tasks').push();

      ref.set(task, function(err){
        if(err){
          dfr.reject(err);
        } else {
          dfr.resolve(ref.key());
        }
      });

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
    
    function _extractNameFromEmail(email) {
      return _ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function _ucfirst (str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }
  }
})();