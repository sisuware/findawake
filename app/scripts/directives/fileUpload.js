'use strict';

/**
 * @ngdoc function
 * @name findawakeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findawakeApp
 */
var app = angular.module('findawakeApp');

app.directive('fileUpload', function(){
  return {
    link: function(scope, element, attrs){
      var reader = new FileReader();
      element.on('change', function(){
        var file = this.files[0];
        reader.readAsDataURL(file);
      });
      reader.onload = function(file){
        scope.$apply(function(){
          scope[attrs.fileUpload] = file.target.result;
        });
      };
    }
  };
});