mygmapFrontendDemoFilters.filter('paginate', function(Paginator) {
		return function(input, rowsPerPage) {
			if (!input) {
				return input;
			}
	
			if (rowsPerPage) {
				Paginator.rowsPerPage = rowsPerPage;
			}
			
			Paginator.itemCount = input.length;
	
			return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
		}	
})

mygmapFrontendDemoFilters.filter('forLoop', function() {
		return function(input, start, end) {
			input = new Array(end - start);
			for (var i = 0; start < end; start++, i++) {
				input[i] = start;
			}
	
			return input;
		}
});