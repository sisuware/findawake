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
      scope.$watch(attrs.objectLength, function(value){
        if(value){
          var count = 0;
          for(key in value){
            count++
          }
          element.text(count);
        } else {
          element.text("0");
        }
      });
    }
  });

  directives.directive('btnLoading', function() {
    return function(scope, element, attrs){
      scope.$watch(attrs.btnLoading, function(value){
        if(value){
          element.button('loading');
        } else {
          element.button('reset');
        }
      });
    }
  });
})(angular);