'use strict';

// Declare Module,Filters and Services
var mygmapFrontendDemo = angular.module('mygmapFrontendDemo', [
  'ngRoute',
  'mygmapFrontendDemo.filters',
  'mygmapFrontendDemo.services',
  'mygmapFrontendDemo.directives',
  'mygmapFrontendDemo.controllers',
  'ngSanitize',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index',	{templateUrl: '../modules/mod_mygmap/ng_templates/partials/partial_mainview.html', controller: 'mainviewcontroller'});
  $routeProvider.otherwise({redirectTo: '/index'});
}]);

var mygmapFrontendDemoController = angular.module('mygmapFrontendDemo.controllers', []);
var mygmapFrontendDemoDirectives = angular.module('mygmapFrontendDemo.directives', []);
var mygmapFrontendDemoFilters	 = angular.module('mygmapFrontendDemo.filters', []);
var mygmapFrontendDemoServices	 = angular.module('mygmapFrontendDemo.services', []);