'use strict';

/*global google:false */

var app = angular.module('google.geocoder', []);

app.factory('Geocoder', function ($q) {
  var geocoderService = {};

  geocoderService.geocode = function(type, location){
    return geocode('address', JSON.stringify(location));
  };

  geocoderService.latlng = function(coords){
    var latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
    return geocode('latLng', latLng);
  };

  function geocode(key, value){
    var dfr = $q.defer(),
        geocoder = new google.maps.Geocoder(),
        obj = {}; obj[key] = value;
    
    geocoder.geocode(obj, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        dfr.resolve(results);
      } else {
        dfr.reject('Geocode was not successful for the following reason: ' + status);
      }
    });
    return dfr.promise;
  }

  return geocoderService;
});