'use strict';

var app = angular.module('imgur', []);

app.run(function($http) {
  $http.defaults.useXDomain = true;
  $http.defaults.headers.common.Authorization = 'Client-ID 64973c9d57c6457';
});

app.factory('Imgur', function ($http, ImgurImageApi) {
  var imgurService = {};

  imgurService.upload = function(img){
    var newUpload = new ImgurImageApi();
    newUpload.image = base64EncodeImage(img);

    return newUpload.$save();
  };

  function base64EncodeImage(image){
    if(image){
      return image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    }
  }

  return imgurService;
});

app.factory('ImgurImageApi', function($resource, IMGUR){
  var url = IMGUR + 'image.json';
  return $resource(url);
});