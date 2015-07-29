(function(){
  'use strict';

  angular
    .module('findAWake')
    .directive('fileUpload', fileUpload);

  function fileUpload(){
    var directive = {
      link: fileUploadController
    };

    return directive;

    function fileUploadController(scope, element, attrs) {
      var reader = new FileReader();
      
      element.on('change', function(){
        var file = this.files[0];
        reader.readAsDataURL(file);
      });
      
      reader.onload = function(file){
        scope.$apply(function(){
          scope[attrs.fileUpload] = file.target.result;
          if (scope && scope.uploadAvatar) {
            scope.uploadAvatar();
          }
          if (scope && scope.uploadThumbnail) {
            scope.uploadThumbnail();
          }
        });
      };
    }
  }
})();