class Address2Controller {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, address2Service, $uibModal) {
        'ngInject';

        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.http = $http;
        this.timeout = $timeout;
        this.address2Service = address2Service;
        this.modal = $uibModal;

        this.loading = false;
        this.reverse = false;
        this.paginateBy = 25;
        this.addresses = [];
        this.searchValue = "";
        this.nextPageUrl = "";
        this.sortColumn = "";
        this.stickyOptions = this.sticky.stickyOptions;

        this.getAddresses();
    }

    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "latitude":
                case "longitude":
                    return this.reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "name":
                case "canonical_name.name":
                case "address1.name":
                case "level":
                case "verified":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }

    getAddresses() {
        this.loading = true;
        this.address2Service.listAddresses(this.getQueryParams())
            .then((promise) => {
                this.addresses = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    loadMoreAddresses() {
        this.loading = true;
        this.address2Service.loadMoreAddresses(this.getQueryParams(true))
            .then((promise) => {
                this.addresses = this.addresses.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    searchAddresses() {
        this.loading = true;
        this.address2Service.searchAddresses(this.getQueryParams())
            .then((promise) => {
                this.addresses = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    getQueryParams(loadMore = false) {
        var params = [];
        params.push({ "name": "page_size", "value": this.paginateBy });
        if (this.nextPageUrl && loadMore) {
            params.push({ "name": "page", "value": this.nextPageUrl });
        }
        if (this.searchValue) {
            params.push({ "name": "search", "value": this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ "name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__")) });
            } else {
                params.push({ "name": "ordering", "value": (this.sortColumn.replace(".", "__")) });
            }
        }
        return params;
    }

    editAddress2(address) {
        var modalInstance = this.modal.open({
            animation: true,
            templateUrl: 'app/addresses/address2Modal.html',
            controller: 'Address2EditModalController as vm',
            size: 'md',
            resolve: {
                address: function () {
                    return address;
                }
            }
        });
        modalInstance.result.then((address) => {
            this.address2Service.saveAddress(address)
                .then(() => {
                    this.getAddresses();
                    window.toastr.success(`Address 2 Successfully Updated!`);
                }, () => {
                    window.toastr.error(`Address 2 Did Not Save Successfully!`);
                });
        });
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/)[0];
            url = url.match(/\d+/)[0];
        }
        return url;
    }
}

export default Address2Controller;