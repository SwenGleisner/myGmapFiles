mygmapFrontendDemoDirectives.directive('gmapgooglemap'
									 ,[ 'Geocoder'
									 ,	'$q'
									 , function(Geocoder,$q) {
    return {
        restrict: 'AE',
		scope: {
			llgmapevents: "=",
			geomulti: "=", 
			showloader: "=",
			homemarker: "=",
			lffilters: "=",
			llalllocation: "=",
			llselectedlocation: "="
		},
        templateUrl: 'ng_templates/directives/dir_gmapgooglemap.html',
		controller: function($scope, $element, $attrs) {								

		},                
		link:function (scope, element, attrs,q) {
			scope.map = {};
			scope.arrayOfMainMarkers = [];
			
			scope.nearestMarker = {pid_location: '', distance: 50000};
			scope.mapRenderer = new google.maps.DirectionsRenderer()
			
			scope.progressBar = angular.element('#progress-bar')
			
			scope.createMap = function(latitude,longitude){
				element.css('height', attrs.height + 'px')
				var myzoom = 15
				if(element[0].id === 'bigmapcontainer'){
					myzoom = 9;
				}
				var mapOptions = {
          			center: new google.maps.LatLng(latitude, longitude),
          			zoom: myzoom,
          			mapTypeId: google.maps.MapTypeId.ROADMAP
        		};
        		scope.map = new google.maps.Map(document.getElementById(element[0].id),mapOptions);
			  	google.maps.event.addListener(scope.map, 'zoom_changed', function() {
					scope.addMarkerToBounds();
			  	});
				google.maps.event.addListener(scope.map, 'idle', function() {
				   scope.addMarkerToBounds();
				});
			}

			scope.addMarkerToBounds = function(){					
				for(var i=0; i < scope.llalllocation.length ;i++){
					var sw = scope.map.getBounds().getSouthWest();
					var ne = scope.map.getBounds().getNorthEast();
					var bounds = new google.maps.LatLngBounds(sw,ne);
					var latitude = scope.llalllocation[i].latitude;
					var longitude = scope.llalllocation[i].longitude;
					if(bounds.contains(new google.maps.LatLng(latitude,longitude))){
						var markerOptions = {};
						markerOptions.pid_location = scope.llalllocation[i].pid_location
						markerOptions.lat = latitude;
						markerOptions.lng = longitude;
						if(scope.llalllocation[i].servicecenter == true){
							markerOptions.image = 'images/office-building.png';
						}
						if(scope.llalllocation[i].servicepoint == true){
							markerOptions.image = 'images/house.png';
						}
						if(scope.llalllocation[i].briefkasten == true && scope.llalllocation[i].servicepoint == false && scope.llalllocation[i].servicecenter == false){
							markerOptions.image = 'images/postal.png';
						}
						scope.setMarker(markerOptions);
					}
				}
			}

			scope.setMarker = function(markerOptions){
				//check if marker is on map
				var pid_location = markerOptions.pid_location;
				if(scope.isOnMap(pid_location) == true){
					return
				} else {
					setTimeout(function() {
						var image = markerOptions.image;
						var myLatlng = new google.maps.LatLng(markerOptions.lat,markerOptions.lng);
						var marker = new google.maps.Marker({
							position: myLatlng,
							map: scope.map,
							icon: image,
							id: markerOptions.pid_location
						});
						google.maps.event.addListener(marker, 'click', function() {
							for(var i=0;i<scope.llalllocation.length;i++){
								if(scope.llalllocation[i].pid_location === this.id){
									scope.llgmapevents.clickSelectLocation(scope.llalllocation[i]);
									scope.$apply();		
								}
							}
						});
						var markerObject = {pid_location: markerOptions.pid_location,marker: marker}
						scope.arrayOfMainMarkers.push(markerObject);
					},200)
				}
			}

			scope.isOnMap = function(pid_location){
				var result = false
				for(var i=0;i<scope.arrayOfMainMarkers.length;i++){
					if(scope.arrayOfMainMarkers[i].pid_location == pid_location){
						result = true;
					}
				}
				return result;
			}

			scope.filterMarker = function(){
				for(var i=0; i<scope.llalllocation.length;i++){
					if(scope.showMarker(scope.llalllocation[i])==true){
						for(var j=0; j<scope.arrayOfMainMarkers.length;j++){
							if(scope.arrayOfMainMarkers[j].pid_location == scope.llalllocation[i].pid_location){
								scope.arrayOfMainMarkers[j].marker.setVisible(true); 
							}
						}
					} else {
						for(var j=0; j<scope.arrayOfMainMarkers.length;j++){
							if(scope.arrayOfMainMarkers[j].pid_location == scope.llalllocation[i].pid_location){
								scope.arrayOfMainMarkers[j].marker.setVisible(false); 
							}
						}
					}	
				}
			}

			scope.showMarker = function(location){				
				if(location.servicecenter === true && scope.lffilters.servicecenter === true){
					return true
				}
				if(location.servicepoint === true && scope.lffilters.servicepoint === true){
					return true
				}
				if(location.briefkasten === true && scope.lffilters.briefkasten === true){
					return true
				}
				return false
			};

			scope.setHomeMarker = function(georesult,address,initflag){
				var latLng = georesult[0].geometry.location;
				var markerOptions = {};
				markerOptions.lat = latLng.lat();
				markerOptions.lng = latLng.lng();
				var myLatlng = new google.maps.LatLng(markerOptions.lat, markerOptions.lng);
				scope.map.setCenter(myLatlng);
				var marker = new google.maps.Marker({
					position: myLatlng,
					map: scope.map,
				});
				scope.homemarker = {address: address, marker: marker,  lat: latLng.lat(),lng: latLng.lng()};
				if(initflag === true){
					scope.initDirectionsService();
				} else {
					scope.llgmapevents.displayRoute(scope.llselectedlocation);
				}		
			}

			scope.initDirectionsService = function(address) {				
				scope.progressBar.attr('style','style="width: 0%"');
				scope.llgmapevents.showLoader('true');
				for(var i=0; i < scope.llalllocation.length;i++){
					var request = {
						origin: new google.maps.LatLng(scope.homemarker.lat, scope.homemarker.lng),
						destination: new google.maps.LatLng(scope.llalllocation[i].latitude, scope.llalllocation[i].longitude),
						travelMode: google.maps.TravelMode.DRIVING
					};
					scope.getRoute(request,i);
				}
			}
			
			scope.getRoute = function(request,index){
				setTimeout(function() {
					var directionsService = new google.maps.DirectionsService();
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							var mydistance = response.routes[0].legs[0].distance.text.split(" ");
							var mydistance = parseFloat(mydistance[0].replace(",", "."));
							scope.llalllocation[index].distance = mydistance;
							scope.llalllocation[index].response = response;
							scope.$apply();
							scope.findNearest(scope.llalllocation[index],index,response,mydistance);							 
						} else {
							console.log('ERROR');
						}
					});
					//Calc % from scope.llalllocation.length
					multi = 100.00 / (scope.llalllocation.length-1)
					scope.progressBar.attr('style','width: ' + multi*index + '%');
					scope.$apply();
					if(index === scope.llalllocation.length-1){
						setTimeout(function() {
							scope.progressBar.attr('style','style="width: 0%"');
							scope.llgmapevents.showLoader(false);
							scope.$apply();
						},1000);
					}
				},index*500);
			}

			scope.llgmapevents.displayRoute = function(location){
				if(typeof scope.homemarker.lat !== 'undefined' && location.latitude !== ''){
					var request = {
						origin: new google.maps.LatLng(scope.homemarker.lat, scope.homemarker.lng),
						destination: new google.maps.LatLng(location.latitude, location.longitude),
						travelMode: google.maps.TravelMode.DRIVING
					};
					var directionsService = new google.maps.DirectionsService();
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							scope.mapRenderer.setMap(scope.map)
							scope.mapRenderer.setDirections(response)							 
						} else {
							console.log('ERROR');
						}
					});
				} else {
					if(typeof scope.nearestMarker.response !== 'undefined'){
						scope.displayNearest();
					}
				}
			}
									
			scope.findNearest = function(location,index,response,mydistance){
				if(mydistance < scope.nearestMarker.distance){
					scope.nearestMarker.distance = 	mydistance;
					scope.nearestMarker.pid_location = location.pid_location;
					scope.nearestMarker.response = response
				}
				if(index == scope.llalllocation.length-1){
					if(typeof scope.llselectedlocation.latitude !== 'undefined'){
						scope.llgmapevents.displayRoute(scope.llselectedlocation);
					} else {
						scope.displayNearest();
					}
				}			
			}
			
			scope.displayNearest = function(){
				scope.mapRenderer.setMap(scope.map);
				scope.mapRenderer.setDirections(scope.nearestMarker.response);
			}
								
			scope.$watch('llselectedlocation', function (llselectedlocation) {
				if(llselectedlocation.latitude.length == 0 || llselectedlocation.longitude.length == 0){
					scope.map.setCenter(new google.maps.LatLng(50.79506, 8.75757));
				} else {
					scope.map.setCenter(new google.maps.LatLng(llselectedlocation.latitude, llselectedlocation.longitude));
					if(scope.homemarker.address !== '' && scope.homemarker.marker == ''){
						scope.homemarker.address = scope.lffilters.address;
						Geocoder.geocode({address: scope.homemarker.address, "componentRestrictions":{"country":"DE"}}).then(function(results) {
								if(scope.homemarker.marker != ''){
									scope.homemarker.marker.setMap(null);
									scope.homemarker.marker = '';
								}
								scope.setHomeMarker(results,scope.homemarker.address,false);			
						});
					} else {
						scope.llgmapevents.displayRoute(llselectedlocation);
					}
				}
				
				if(typeof scope.llalllocation !== 'undefined') {
					scope.addMarkerToBounds();
				}	
			});

			scope.$watch('llalllocation', function (llalllocation) {
				if(typeof scope.llalllocation !== 'undefined' && typeof  scope.map.getBounds() !== 'undefined') {
					scope.addMarkerToBounds();
				}	
			});

			scope.$watch('homemarker.address', function (newValue, oldValue) {
				if(scope.lffilters.address !== newValue){
					scope.homemarker.address = scope.lffilters.address;
					Geocoder.geocode({address: scope.homemarker.address, "componentRestrictions":{"country":"DE"}}).then(function(results) {
							if(scope.homemarker.marker != ''){
								scope.homemarker.marker.setMap(null);
								scope.homemarker.marker = '';
							}
							scope.setHomeMarker(results,scope.homemarker.address,false);			
					});				
				}
			});
			
			scope.$watch('lffilters', function (lffilters) {
				if(typeof scope.lffilters !== 'undefined') {
					scope.filterMarker();
				}
			},true);

			scope.$watch('lffilters.action', function (newValue, oldValue) {
				if(oldValue !== newValue){
					if(typeof scope.lffilters.address !== 'undefined' 
						&& scope.lffilters.address.length > 0
						&& scope.lffilters.address !== scope.homemarker.address) {
						scope.homemarker.address = scope.lffilters.address;
						Geocoder.geocode({address: scope.homemarker.address, "componentRestrictions":{"country":"DE"}}).then(function(results) {
							if(results.length > 1){
								scope.geomulti.push(results);
							} else {
								if(scope.homemarker.marker != ''){
									scope.homemarker.marker.setMap(null);
									scope.homemarker.marker = '';
								}
								scope.nearestMarker = {pid_location: '', distance: 50000};
								scope.setHomeMarker(results,scope.homemarker.address,true);			
							}
						});
					}
				}
			},true);
																		
			scope.createMap(50.79506,8.75757);
		}
    } // return
  } // function
])