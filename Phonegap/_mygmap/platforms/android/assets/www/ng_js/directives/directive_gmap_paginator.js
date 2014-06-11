mygmapFrontendDemoDirectives.directive('paginator', function factory() {
    return {
        restrict: 'E',
        controller: function ($scope, Paginator) {
            $scope.paginator = Paginator;
        },
        templateUrl: 'ng_templates/directives/dir_gmappaginator.html'
    };
});