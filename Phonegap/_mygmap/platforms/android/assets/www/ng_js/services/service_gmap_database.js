mygmapFrontendDemoServices.service("Database", ["$rootScope", "$q", "$http", function ($rootScope, $q, $http) {
	var defaultSettings = {
		dbMethod		: 'POST',
		dbURL			: 'http://mygmap.synology.me/_mygmap/index.php?option=com_ajax&module=mygmap&format=json&Itemid=109',
		dbDataCommand	: null,
		dbDataArray		: null,
		dbHeader		: {'Content-Type': 'application/x-www-form-urlencoded'}
	}
	
	this.query = function(dbDataCommand,pid_location) {
		var deferred = $q.defer(dbDataCommand);
			$http({method: defaultSettings.dbMethod, 
				   url: defaultSettings.dbURL,
				   data:  {cmd: dbDataCommand, pid_location: pid_location},
				   headers: defaultSettings.dbHeader
				  })
				.success(function(result) {
					setTimeout(function() {
						$rootScope.$apply(function () {
							deferred.resolve(result);
						});
					},1000)
				})
				.error(function(result) {
					$rootScope.$apply(function () {
						deferred.reject(error);
					});
				});
		return deferred.promise;
	}
}]);