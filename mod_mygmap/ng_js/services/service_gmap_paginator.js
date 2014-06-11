mygmapFrontendDemoServices.service('Paginator', function () {
    this.page = 0;
    this.rowsPerPage = 5;
    this.itemCount = 0;

    this.setPage = function (page) {
        if (page > this.pageCount()) {
            return;
        }

        this.page = page;
    };

    this.nextPage = function () {
        if (this.isLastPage()) {
            return;
        }

        this.page++;
    };

    this.perviousPage = function () {
        if (this.isFirstPage()) {
            return;
        }

        this.page--;
    };

    this.firstPage = function () {
        this.page = 0;
    };

    this.lastPage = function () {
        this.page = this.pageCount() - 1;
    };

    this.isFirstPage = function () {
        return this.page == 0;
    };

    this.isLastPage = function () {
        return this.page == this.pageCount() - 1;
    };

	this.getPage = function () {
		return this.page
	}
	
    this.pageCount = function () {
        return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
    };
})