mygmapFrontendDemoDirectives.directive('gmapfilterbar', function() {
    return {
        restrict: 'A,E',
		scope: {
			geomulti: "=",
			lfsearchfilter: '='
		},
        templateUrl: '../modules/mod_mygmap/ng_templates/directives/dir_gmapfilterbar.html',
		controller: function($scope) {			
			$scope.lfsearchfilter = {
				address: '',
				servicecenter: true,
				servicepoint: true,
				briefkasten: true,
				action: false				
			}
			$scope.updateFilter = function(){
				$scope.geomulti = [];
				$scope.lfsearchfilter.action = !$scope.lfsearchfilter.action
			}	
		}
	};
});