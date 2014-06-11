mygmapFrontendDemoDirectives.directive('gmaplocationdetail', ["Database"
															   , function factory(Database) {
    return {
        restrict: 'E',
		scope: { 
			llgmapevents: "=",
			geomulti: "=",
			homemarker: "=",
			lffilters: "=",
			llalllocation: "=",
			llselectedlocation: "="
		},
        templateUrl:  'ng_templates/directives/dir_gmaplocationdetail.html',
		controller: function($scope) {
			
			$scope.$watch("llselectedlocation", function() {
				$scope.timetableHasCategory($scope.llselectedlocation.timetable)
				$scope.filterLocationCategoryNames($scope.llselectedlocation.services)			
			},true);
					
			$scope.ttCategories = [{id:'1', name:'Öffnungszeiten'},{id:'2', name:'Entleerungszeiten'}]
			$scope.hideOpenTime = true
			$scope.hideEmptyTime = true
			
			$scope.timetableHasCategory = function(timetable){
				$scope.hideOpenTime = true
				$scope.hideEmptyTime = true
				for(var i=0;i < timetable.length;i++){
					if(timetable[i].pid_timetablecategory == '1'){
						$scope.hideOpenTime = false
					}
					if(timetable[i].pid_timetablecategory == '2'){
						$scope.hideEmptyTime = false
					}
				}			
			}

			$scope.locationServiceCategories = [];
			$scope.servicecategories = [];
			
			$scope.filterLocationCategoryNames = function(services){
				$scope.locationServiceCategories = [];
				$scope.servicecategories = [];
				
				for(var i=0; i<services.length; i++){
					if($scope.locationServiceCategories.length == 0){
						$scope.locationServiceCategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
						$scope.servicecategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
					}
					var compare = services[i].categoryname;
					var found = false
					for(var j=0; j<$scope.locationServiceCategories.length; j++){
						if(compare == $scope.locationServiceCategories[j].categoryname){
							found = true;
						}
					}
					if(!found){
						$scope.locationServiceCategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
					}
					var comparepid = services[i].pid_servicecategory;
					var pidfound = false
					for(var j=0; j<$scope.servicecategories.length; j++){
						if(comparepid == $scope.servicecategories[j].pid_servicecategory){
							pidfound = true;
						}
					}
					if(!pidfound){
						$scope.servicecategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
					}
				}
				if($scope.servicecategories.length > 0){
					$scope.myservicefilter = $scope.locationServiceCategories[0].pid_servicecategory;
				}
			}
		}
		
	};
}]);