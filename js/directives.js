(function(angular) {
  var directives = angular.module('pullme.directives', []);

  directives.directive('fileUpload', function($timeout) {
    return function(scope, element, attrs){
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
  });

  directives.directive('objectLength', function($timeout) {
    return function(scope, element, attrs){
      var params = attrs.objectLength.split('.');
      var object = scope;
      for (var i = 0; i < params.length; i++) {
        object = object[params[i]];
      };
      if(object){
        var count = 0;
        for(key in object){
          count++
        }
        element.text(count);
      } else {
        element.text("0");
      }
    }
  });
})(angular);