mygmapFrontendDemoController.controller('mainviewcontroller', 
	["$scope"
	, "$http"
	, "Database"
	, function ($scope
				, $http
				, Database) 
	{
		$scope.showDetailView = false;
		$scope.listView = false;
		$scope.showLoader = false;
		$scope.gmapAllLocation = [];
		$scope.gmapSelectedLocation = {
			pid_location: '',
			latitude: '',
			longitude: '',
			timetable: {},
			services: {}
		}
		$scope.requestedLocations = [];
		$scope.geocoderMulti = [];
		$scope.searchFilter = {};
		$scope.gmapEvents = {};
		$scope.homeMarker = {address: '', marker: ''};
		
		$scope.initApp = function(joomla_maincontainer_id,joomla_fixed_header_id,joomla_fixed_footer_id){
			/*
			console.log("########## CALL initApp() / mainviewcontroller ##########");
			console.log("# PARAMETER:");
			console.log("# joomla_maincontainer_id: " + joomla_maincontainer_id);
			console.log("# joomla_fixed_header_id: " + joomla_fixed_header_id);
			console.log("# joomla_fixed_footer_id: " + joomla_fixed_footer_id);
			console.log("#########################################################")
			*/
			//Calculate the module Size for 100% Main-Map-Height with Bootstrap Framework
			var mainHeight = angular.element('#' + joomla_maincontainer_id).height();
			var mainChildrenHeight = angular.element('#' + joomla_maincontainer_id).children().height();
			var headerHeight = angular.element('#' + joomla_fixed_header_id).height();	
			var footerHeight = angular.element('#' + joomla_fixed_footer_id).height();
			//Check Bootstrap Class and adjust height for map container
			var classes = ['xs', 'sm', 'md'];
			var check = angular.element('<div>');
			check.appendTo(angular.element('body'));
			for (var i = classes.length - 1; i >= 0; i--) {
				var chkclass = classes[i];
				check.addClass('hidden-'+chkclass);
				if (check.is(':hidden')) {
					check.remove();
				}
			};
			var googlemapHeight = mainHeight - mainChildrenHeight - 30;
			$scope.gmapOptionsBigMap = googlemapHeight;
			/*
			console.log("########## HEIGHT CALCULATION ##########");
			console.log("# RESULTS:");
			console.log("# mainHeight: " + mainHeight);
			console.log("# mainChildrenHeight: " + mainChildrenHeight);
			console.log("# headerHeight: " + headerHeight);
			console.log("# footerHeight: " + footerHeight);
			console.log("#########################################################")
			*/		
			//Request Database for a List with All-Locations(AddressData and Geo)
			var dbDataCommand = 'selectAllLocation';
			var dbServicePromise = Database.query(dbDataCommand,null);
			/*
			console.log("########## HTTP REQUEST ##########");
			console.log("# COMMANDS:");
			console.log("# dbDataCommand: " + dbDataCommand);
			console.log("#########################################################")
			*/
				dbServicePromise.then(function(result) {
					if(result.success == false){
						/*
						console.log("# RESULT:" + dbDataCommand);
						console.log("# result.success: false");
						console.log("# ERROR ");
						console.log("#########################################################")
						*/
						alert('Die Datenbank konnte die Anfrage nicht verarbeiten')
					}
					if(result.success == true){
						$scope.gmapAllLocation = result.data.data;
						/*
						console.log("# RESULT:" + dbDataCommand);
						console.log("# result.success: true");
						console.log("# result.data.data.length: " + result.data.data.length);
						console.log("# Object-Model: ");
						console.log(result.data.data[0])
						console.log("#########################################################")
						*/
						$scope.prepareLocationArray();
						$scope.$broadcast('rebuild:me');
					}				
				}, function(error) {
					console.log(error);
			});		
		}
		
		$scope.prepareLocationArray = function(){
			for(var i=0; i < $scope.gmapAllLocation.length; i++){
				$scope.gmapAllLocation[i].servicecenter = false;
				$scope.gmapAllLocation[i].servicepoint = false;
				$scope.gmapAllLocation[i].briefkasten = false;
				if($scope.gmapAllLocation[i].fid_category == 0){
					$scope.gmapAllLocation[i].servicecenter = true;
				}
				if($scope.gmapAllLocation[i].fid_category == 1){
					$scope.gmapAllLocation[i].servicepoint = true;
				}
				if($scope.gmapAllLocation[i].fid_category == 2){
					$scope.gmapAllLocation[i].briefkasten = true;
				}
				for(var j=0; j < $scope.gmapAllLocation.length; j++){
					if($scope.gmapAllLocation[i].pid_location == $scope.gmapAllLocation[j].pid_location){
						if($scope.gmapAllLocation[j].fid_category == 0){
							$scope.gmapAllLocation[i].servicecenter = true;
						}
						if($scope.gmapAllLocation[j].fid_category == 1){
							$scope.gmapAllLocation[i].servicepoint = true;
						}
						if($scope.gmapAllLocation[j].fid_category == 2){
							$scope.gmapAllLocation[i].briefkasten = true;
						}
					}				
				}
				$scope.gmapAllLocation[i].distance = '';				
			}
			var helper = []
			for(var i=0; i < $scope.gmapAllLocation.length; i++){
				if(helper.length == 0){
					helper.push($scope.gmapAllLocation[i]);	
				}
				var found = false;
				for(var j=0; j < helper.length; j++){
					if($scope.gmapAllLocation[i].pid_location == helper[j].pid_location){
						found = true
					}		
				}
				if(found == false){
					helper.push($scope.gmapAllLocation[i]);	
				}					
			}
			$scope.gmapAllLocation = angular.copy(helper);
		}
		
		$scope.wasRequested = function(pid_location){
			var result = {
				havewatched: false,
				location: null
			}
			for(var i=0;i < $scope.requestedLocations.length;i++){
				if(pid_location == $scope.requestedLocations[i].pid_location){
					result.havewatched = true;
					result.location = $scope.requestedLocations[i]
				}
			}
			return result
		}
		
		$scope.clickSetAddress = function(address){
			$scope.searchFilter.address = address;
			$scope.searchFilter.action = !$scope.searchFilter.action;
			$scope.geocoderMulti = [];
		}
		
		$scope.gmapEvents.showLoader = function(mybool){
			$scope.showLoader = mybool;
		}
												
		$scope.gmapEvents.clickSelectLocation = function(location){
			var pid_location = location.pid_location;
			var result = $scope.wasRequested(pid_location);
			if(result.havewatched == true){
				$scope.gmapSelectedLocation = result.location;
				$scope.showDetailView = true;	
			} else {
				//Catch all Data from this Location
				var dbDataCommand = 'selectLocationDetails';
				var dbServicePromise = Database.query(dbDataCommand,pid_location);
					dbServicePromise.then(function(result) {
						if(result.success == false){
							alert('Die Datenbank konnte die Anfrage nicht verarbeiten')
						}
						if(result.success == true){
							location.timetable = result.data.data.timetables;
							location.services = result.data.data.services;
							$scope.requestedLocations.push(location);
							$scope.gmapSelectedLocation = location;
							$scope.showDetailView = true;		
						}				
					}, function(error) {
						console.log(error);
				});	
			}
		}
		
		$scope.gmapEvents.clickMapView = function(){
			$scope.showDetailView = false;
		}
    }
]);		
