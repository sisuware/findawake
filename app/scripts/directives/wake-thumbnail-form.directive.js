(function(){
	'use strict';

	angular
		.module('findAWake')
		.directive('wakeThumbnailForm', wakeThumbnailForm);

	wakeThumbnailForm.$inject = ['Imgur'];

	function wakeThumbnailForm(Imgur) {
    var _html = '<div class="row form-group">';
        _html += '  <div ng-cloak ng-show="errors" class="alert alert-danger"><strong>{{errors}}</strong></div>';
        _html += '  <div class="col-xs-3">';
        _html += '    <img avatar="{{wake.thumbnail}}" size="t" style="rounded" />';
        _html += '    <div ng-cloak ng-hide="wake.thumbnail" class="img-thumbnail text-center">';
        _html += '      <small ng-hide="uploadingThumbnail">No<br/>Thumbnail</small>';
        _html += '      <i ng-cloak ng-show="uploadingThumbnail" class="fa fa-spinner fa-spin"></i>';
        _html += '    </div>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-show="wake.thumbnail && !existingThumbnail" class="col-xs-9 text-right">';
        _html += '    <button type="button" class="btn btn-sm btn-danger" ng-click="deleteThumbnail()"><i class="fa fa-trash-o"></i></button>';
        _html += '    <button type="button" class="btn btn-sm btn-info" ng-click="changeThumbnail()">Change</button>';
        _html += '  </div>';
        _html += '  <div ng-cloak ng-hide="wake.thumbnail && !existingThumbnail" class="col-xs-9" ng-form="thumbnailForm">';
        _html += '    <div class="form-group input-group">';
        _html += '      <input type="file" class="form-control input-sm" file-upload="thumbnail" required name="thumbnail"/>';
        _html += '      <span class="input-group-btn">';
        _html += '        <button class="btn btn-sm btn-success" ng-disabled="!thumbnail || uploadingThumbnail" ng-click="uploadThumbnail()" ng-bind="uploadingThumbnail ? \'Uploading...\':\'Upload\'"></button>';
        _html += '      </span>';
        _html += '    </div>';
        _html += '    <button ng-cloak ng-show="existingThumbnail" type="button" class="btn btn-sm btn-warning" disabled="uploadingThumbnail" ng-click="cancelChangeThumbnail()">Cancel</button>';
        _html += '  </div>';
        _html += '</div>';

		var directive = {
			template: _html,
			controller: wakeThumbnailController,
			scope: {
				wake: '='
			}
		};

		wakeThumbnailController.$inject = ['$scope','$element','$attrs'];

		return directive;

		function wakeThumbnailController($scope, $element, $attrs) {
			$scope.uploadThumbnail = uploadThumbnail;
      $scope.changeThumbnail = changeThumbnail;
      $scope.cancelChangeThumbnail = cancelChangeThumbnail;
      $scope.deleteThumbnail = deleteThumbnail;

      function deleteThumbnail() {
        delete $scope.wake.thumbnail;
      }

      function changeThumbnail(){
        $scope.existingThumbnail = angular.copy($scope.wake.thumbnail);
      }

      function cancelChangeThumbnail(){
        $scope.wake.thumbnail = $scope.existingThumbnail;
        $scope.existingThumbnail = false;
      }
      
      function uploadThumbnail(){
        $scope.uploadingThumbnail = true;
        $scope.errors = false;

        Imgur.upload($scope.thumbnail).then(function(res){
          $scope.wake.thumbnail = res.data.id;
        }, function(res){
          $scope.errors = res;
        }).finally(function(){
          $scope.uploadingThumbnail = false;
          $scope.existingThumbnail = false;
        });
      }
		}
	}
})();