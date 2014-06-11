mygmapFrontendDemoDirectives.directive('gmaplocationlist', ["Database"
															, function(Database) {
    return {
        restrict: 'E',
		scope: {
			lffilters: "=", 
			llgmapevents: "=",
			llalllocation: "=",
		},
        templateUrl: 'ng_templates/directives/dir_gmaplocationlist.html',
		controller: function($scope) {
			$scope.llfilteredlocation = [];
									
			$scope.showLocation = function(location){				
				if(location.servicecenter === true && $scope.lffilters.servicecenter === true){
					return true
				}
				if(location.servicepoint === true && $scope.lffilters.servicepoint === true){
					return true
				}
				if(location.briefkasten === true && $scope.lffilters.briefkasten === true){
					return true
				}
				return false
			};						
		}
	};
}]);
