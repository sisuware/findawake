(function(){
  'use strict';

  angular
    .module('google.geocoder', [])
    .factory('Geocoder', Geocoder);

  Geocoder.$inject = ['$q'];

  function Geocoder($q) {
    var service = { 
      geocode: geocode,
      latlng: latlng
    };

    return service;

    function geocode(type, location) {
    return _geocoder('address', JSON.stringify(location));
    }

    function latlng(coords) {
      var latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      return _geocoder('latLng', latLng);
    }

    function _geocoder(key, value) {
      var dfr = $q.defer();
      var geocoder = new google.maps.Geocoder();
      var obj = {}; 

      obj[key] = value;
      
      geocoder.geocode(obj, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          dfr.resolve(results);
        } else {
          dfr.reject('Geocode was not successful for the following reason: ' + status);
        }
      });
      return dfr.promise;
    }
  }
})();