mygmapFrontendDemoController.controller('mainviewcontroller', 
	["$scope"
	, "$http"
	, function ($scope
				, $http) 
	{
		$scope.showdetail = true;
		$scope.mainmap = '';
		$scope.createdmap = '';
		$scope.llalllocation = ''	
		$scope.llselectedlocation = {
			pid_location: '',
			latitude: '',
			longitude: '',
			timetable: {},
			services: {}
		}
		$scope.lfaddress = ''
		$scope.lfaction = {
			searchLocation: ''	
		}
		//Surely THAT HAVE TO BE CHANGED ON ANOTHER LAYOUT
		//Calculate the module Size for the ideal Map-Height with Bootstrap Framework
		var mainHeight = angular.element('#maincontainer').height();
		var mainChildrenHeight = angular.element('#maincontainer').children().height();
		var footerHeight = angular.element('#footer').height();
		var navbarHeight = angular.element('.navbar').height();
		
		//Look which Bootstrap Class and adjust height for map container
		var classes = ['xs', 'sm', 'md'];
		var check = angular.element('<div>');
		check.appendTo(angular.element('body'));
		for (var i = classes.length - 1; i >= 0; i--) {
			var chkclass = classes[i];
			check.addClass('hidden-'+chkclass);
			if (check.is(':hidden')) {
				check.remove();
				//Which Bootstrap Orientation, if Portrait the filterbar and locationlist mustbe 3x
				if(window.innerHeight > window.innerWidth){
					mainChildrenHeight = mainChildrenHeight * 3;
				}
			}
		};
		var googlemapHeight = mainHeight - mainChildrenHeight - footerHeight - navbarHeight;
		//END
		
		//Map-Settings Main-View
		$scope.mapoptions = {
			height: googlemapHeight,
		}
    }
]);		
