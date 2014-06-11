mygmapFrontendDemoServices.service('Geocoder', ['$q', function($q) {
	return {
		geocode : function(options) {
			var deferred = $q.defer();
		  	var geocoder = new google.maps.Geocoder();
		  	geocoder.geocode(options, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
			  		deferred.resolve(results);
				} else {
			  		deferred.reject('Adresse konnte nicht ermittelt werden: '+ status);
				}
		  	});
		  	return deferred.promise;
		}
	}
}]);