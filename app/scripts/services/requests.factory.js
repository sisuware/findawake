(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('Requests', Requests);

  Requests.$inject = ['syncData', 'FirebaseModels','$q'];

  function Requests(syncData, FirebaseModels, $q) {
    var service = {
      get: get,
      query: query,
      create: createRequest,
      accept: acceptRequest,
      decline: declineRequest
    };

    return service; 

    function query(id) {
      return syncData.array('requests/' + id).$loaded();
    }

    function get(request) {
      // if(_.isUndefined(auth) || _.isEmpty(auth)){ return false; }
      // if(_.isObject(auth.requests)){
      //   return !_.isUndefined(auth.requests[wake.id]);
      // }
      // if(_.isArray(auth.requests)){
      //   return _.indexOf(auth.requests, wake.id) === -1;
      // }
      return syncData.object('requests/' + request.wakeId + '/' + request.id).$loaded();
    }

    function createRequest(request) {  
      // first create a top level request reference of the wake id.
      return FirebaseModels.createRef('requests/' + request.wakeId, request).then(function(requestRef){
        // second update the user with his new request reference
        return FirebaseModels.createUserAssociation('users', 'requests/' + request.wakeId, requestRef, 'set');
      });
    }

    function acceptRequest(request) {
      return get(request).then(function(ref){
        ref.accepted = true;
        ref.declined = false;
        return ref.$save();  
      });
      
    }

    function declineRequest(request) {
      return FirebaseModels.createRef('requests/' + request.wakeId + '/declined', request.id);
    }

    function _handleError(error) {
      console.debug(error);
    }
  }
})();