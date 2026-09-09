(function(){
  'use strict';

  angular
    .module('imgur', [])
    .constant('IMGUR_API', 'https://api.imgur.com/3/')
    .run(imgurRunConfig)
    .factory('Imgur', Imgur)
    .factory('ImgurImageApi', ImgurImageApi);

  imgurRunConfig.$inject = ['$http'];
  Imgur.$inject = ['ImgurImageApi'];
  ImgurImageApi.$inject = ['$resource', 'IMGUR_API'];

  function imgurRunConfig($http) {
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common.Authorization = 'Client-ID 64973c9d57c6457';
  }

  function Imgur(ImgurImageApi) {
    var service = {
      upload: upload
    };

    return service;

    function upload(img) {
      var newUpload = new ImgurImageApi();
      newUpload.image = _base64EncodeImage(img);

      return newUpload.$save();
    }
  }

  function ImgurImageApi($resource, IMGUR_API) {
    var url = IMGUR_API + 'image.json';
    return $resource(url);
  }

  function _base64EncodeImage(image){
    if(image){
      return image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    }
  }
})();