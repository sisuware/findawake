pullme.service('AuthService', [
  "$rootScope",
  "$location",

  function($rootScope,$location) {
    var url = new Firebase("https://pullme.firebaseio.com");
    this.auth = new FirebaseSimpleLogin(url, function(error, user) {
      if (user) {
        $rootScope.$emit("login", user);
      } else if (error) {
        $rootScope.$emit("loginError", error);
      } else {
        $rootScope.$emit("logout");
      }
    });
  }
]);