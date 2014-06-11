'use strict';

/* Filters */
var mygmapAppFilters = angular.module('mygmapApp.filters', []);

mygmapAppFilters.filter('getLocationCategory', function() {
		return function(fid_category,allcategories) {
			for (var i=0; i < allcategories.length ; i++) {
		  		if(allcategories[i].fid_category == fid_category) {
					return true;
		  	}
		}
		return false;
	}
});
