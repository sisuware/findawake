(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Requests', Requests);

  Requests.$inject = ['syncData', 'FirebaseModels','$q'];

  function Requests(syncData, FirebaseModels, $q) {
    function query(id) {
      return syncData('requests/' + id).$loaded();
    }

    function get(id) {
      // if(_.isUndefined(auth) || _.isEmpty(auth)){ return false; }
      // if(_.isObject(auth.requests)){
      //   return !_.isUndefined(auth.requests[wake.id]);
      // }
      // if(_.isArray(auth.requests)){
      //   return _.indexOf(auth.requests, wake.id) === -1;
      // }
    }

    function createRequest(request) {  
      // first create a top level request reference of the wake id.
      return FirebaseModels.createRef('requests/' + data.wakeId, request).then(function(requestRef){
        // second update the user with his new request reference
        return FirebaseModels.createUserAssociation('users', 'requests/' + data.wakeId, requestRef, 'set');
      });
    }

    function removeRequest() {

    }

    function _handleError(error) {
      console.debug(error);
    }
  }
})();