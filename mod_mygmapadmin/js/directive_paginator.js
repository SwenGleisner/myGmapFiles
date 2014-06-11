mygmapAppDirectives.directive('paginator', function factory() {
    return {
        restrict: 'E',
        controller: function ($scope, Paginator) {
            $scope.paginator = Paginator;
        },
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_paginator.html'
    };
});