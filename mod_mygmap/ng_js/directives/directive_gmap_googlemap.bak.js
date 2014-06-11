mygmapFrontendDemoDirectives.directive('gmapgooglemap'
									 ,[ 'Geocoder'
									 , function(Geocoder) {
    return {
        restrict: 'E',
		scope: { 
			mapoptions: '=',
			llalllocation: '=',
			llselectedlocation: '=',
			lfaddress: '=',
			lfaction: '=',
			mainview: '=',
			mainmap: '=',
			createdmap: '='
		},
        templateUrl: '../modules/mod_mygmap/ng_templates/directives/dir_gmapgooglemap.html',
		controller: function($scope, $q) {								
			$scope.defaultOptions = {
				center: new google.maps.LatLng(50.79506, 8.75757), //The worlds most pretty Town Marburg :)
				zoom: 10
			}
			$scope.createdmap = '';
			
			$scope.createMap = function(container){
				if(container == 'detailViewMap'){
					angular.element('#' + container).children().remove();
					parent = document.getElementById(container);
					createdMap = document.createElement('div');
					createdMap.id = 'detailViewMapContainer';
					parent.appendChild(createdMap)
					angular.element('#detailViewMapContainer').css('height', '325px');
					var defaultOptions = {
						zoom: 15
					}		
					$scope.createdmap = new google.maps.Map(createdMap, defaultOptions);
					google.maps.event.addListener($scope.createdmap, 'idle', function() {
						$scope.addMarkerToBounds($scope.createdmap);
					});
				}
				if(container == 'mainViewMap'){
					parent = document.getElementById(container);
					mainMap = document.createElement('div');
					mainMap.id = 'mainViewMapContainer';
					parent.appendChild(mainMap)
					angular.element('#mainViewMapContainer').css('height', $scope.mapoptions.height + 'px');		
					$scope.mainmap = new google.maps.Map(mainMap, $scope.defaultOptions);
					google.maps.event.addListener($scope.mainmap, 'idle', function() {
						$scope.addMarkerToBounds($scope.mainmap);	
					});
				}
			}
							
			$scope.llselectedlocation.initMap = function(container){
				//remove All Children for an empty Container
				if(container == 'detailViewMap'){
					$scope.createMap(container)
				}
				if(container == 'mainViewMap'){
					$scope.createMap(container)
				}
			}
			
			$scope.$watch("llselectedlocation", function() {
				var pid_location = $scope.llselectedlocation.pid_location;
				var latitude = $scope.llselectedlocation.latitude;
				var longitude = $scope.llselectedlocation.longitude
				if($scope.createdmap != '' && $scope.mainmap == ''){
					if(latitude != '' && longitude != ''){
						$scope.createdmap.setCenter(new google.maps.LatLng(latitude,longitude));
					}
				}
			},true);
			
			
			$scope.multiGeocodeResult = {};
			$scope.currentGeoLocation = {};
						
			$scope.registerInputs = function(){
				var strInputId = $scope.gmmap.gmFilterInputIds.inputAutocomplete
				if(strInputId.length > 0){
					var options = {
						componentRestrictions: {country: 'DE'}
					};
					input = document.getElementById(strInputId); 
					new google.maps.places.Autocomplete(input, options)				
				}
			}
			
			$scope.$watch("llalllocation", function() {
				if($scope.createdmap == '' && $scope.mainmap != ''){
					$scope.addMarkerToBounds();
				}
			},true);
			
			$scope.addMarkerToBounds = function(){					
				if($scope.createdmap == '' && $scope.mainmap != ''){
					for(var i=0; i < $scope.llalllocation.length ;i++){
						var sw = $scope.mainmap.getBounds().getSouthWest();
						var ne = $scope.mainmap.getBounds().getNorthEast();
						var bounds = new google.maps.LatLngBounds(sw,ne);
						var latitude = $scope.llalllocation[i].latitude;
						var longitude = $scope.llalllocation[i].longitude;
						if(bounds.contains(new google.maps.LatLng(latitude,longitude))){
							var markerOptions = {};
							markerOptions.pid_loction = $scope.llalllocation[i].pid_location
							markerOptions.lat = latitude;
							markerOptions.lng = longitude;
							$scope.setMarker(markerOptions,'main');
						}
					}
				}
				if($scope.createdmap != '' && $scope.mainmap == ''){
					for(var i=0; i < $scope.llalllocation.length ;i++){
						var sw = $scope.createdmap.getBounds().getSouthWest();
						var ne = $scope.createdmap.getBounds().getNorthEast();
						var bounds = new google.maps.LatLngBounds(sw,ne);
						var latitude = $scope.llalllocation[i].latitude;
						var longitude = $scope.llalllocation[i].longitude;
						if(bounds.contains(new google.maps.LatLng(latitude,longitude))){
							var markerOptions = {};
							markerOptions.pid_loction = $scope.llalllocation[i].pid_location
							markerOptions.lat = latitude;
							markerOptions.lng = longitude;
							$scope.setMarker(markerOptions,'detail');
						}
					}
				}
			}
			
			$scope.arrayOfMainMarkers = []			
			
			$scope.setMarker = function(markerOptions,flag){
				//check if marker is on map
				var pid_location = markerOptions.pid_loction;
				if($scope.isOnMap(pid_location) == true){
					return
				} else {
					setTimeout(function() {
						var image = '../modules/mod_mygmap/images/postal.png';
						if(flag == 'main'){
							var myLatlng = new google.maps.LatLng(markerOptions.lat,markerOptions.lng);
							var marker = new google.maps.Marker({
								position: myLatlng,
								map: $scope.mainmap,
								icon: image
							});
							var markerObject = {pid_location: markerOptions.pid_loction,marker: marker}
							$scope.arrayOfMainMarkers.push(markerObject);
						}
						if(flag == 'detail'){
							mymap = $scope.createdmap;
							var myLatlng = new google.maps.LatLng(markerOptions.lat,markerOptions.lng);
							var marker = new google.maps.Marker({
								position: myLatlng,
								map: $scope.createdmap,
								icon: image
							});
							var markerObject = {pid_location: markerOptions.pid_loction,marker: marker}
							$scope.arrayOfMainMarkers.push(markerObject);
						}
						/*if(flag == 'own'){
							var myLatlng = new google.maps.LatLng(markerOptions.lat,markerOptions.lng);
							var marker = new google.maps.Marker({
								position: myLatlng,
								map: $scope.createdmap,
							});
						}*/

					},200)
				}
			}
			
			$scope.isOnMap = function(pid_location){
				var result = false
				for(var i=0;i<$scope.arrayOfMainMarkers.length;i++){
					if($scope.arrayOfMainMarkers[i].pid_location == pid_location){
						result = true;
					}
				}
				return result;
			}	
			
			$scope.llaction = {};
			$scope.llaction.zoomToMarker = function(pid_location){
				for(var i=0;i<$scope.arrayOfMainMarkers.length;i++){
					if($scope.arrayOfMainMarkers[i].pid_location == pid_location){
						var marker = $scope.arrayOfMainMarkers[i].marker;
						$scope.map.setCenter(marker.getPosition());
					}
				}				
			}
			
			$scope.lfaction.searchLocation = function(address){
				Geocoder.geocode({address: address, "componentRestrictions":{"country":"DE"}}).then(function(results) {
					if(results.length > 1){
						console.log(results)
						$scope.gmmap.viewMap = false;
						$scope.gmmap.viewMultiGeo = true;
						$scope.multiGeocodeResult = results;
					} else {
						var latLng = results[0].geometry.location;
						var markerOptions = {};
						markerOptions.lat = latLng.lat();
						markerOptions.lng = latLng.lng();
						$scope.setMarker(markerOptions,'own');			
					}
				});				
			}	
		}
    } // return
  } // function
])