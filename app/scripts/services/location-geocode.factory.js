(function(){
  'use strict';

  angular
    .module('findAWake')
    .factory('LocationGeocode', locationGeocode);

  locationGeocode.$inject = ['$q', 'Geocoder', '$timeout'];

  function locationGeocode($q, Geocoder, $timeout) {
    var service = {
      validate: validate
    };

    return service;

    function validate(address) {
      var dfr = $q.defer();

      if (!address || address && !address.city || address && !address.state) {
        dfr.reject('City and State are required.');
      }

      Geocoder.geocode('address', address).then(function(res){
        dfr.resolve(_formatGeocoderResults(res));
      }, function(res){
        dfr.reject(res);
      });
      
      return dfr.promise;
    }

    function getDistance(current, target) {
      var fromLatLng = new google.maps.LatLng(current.lat, current.lng);
      var toLatlng = new google.maps.Latlng(target.lat, target.lng);

      return Math.round(google.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatlng) * 0.000621371192);
    }


    function _formatGeocoderResults(data) {
      /*jshint camelcase: false */
      return _.map(data, function(datum){
        var datumObj = {};
        
        datum.address_components.forEach(function(address){
          datumObj[_.first(address.types)] = address.long_name;
        });

        datumObj.formatted = datum.formatted_address;
        datumObj.lat = datum.geometry.location.lat();
        datumObj.lng = datum.geometry.location.lng();

        return datumObj;
      }); 
    }
  }
})();