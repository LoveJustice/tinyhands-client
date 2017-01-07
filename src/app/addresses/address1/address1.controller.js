class Address1Controller {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, address1Service, $uibModal) {
        'ngInject';

        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.http = $http;
        this.timeout = $timeout;
        this.address1Service = address1Service;
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
                case "level":
                case "completed":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }


    getAddresses() {
        this.loading = true;
        this.address1Service.listAddresses(this.getQueryParams())
            .then((promise) => {
                this.addresses = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    loadMoreAddresses() {
        this.loading = true;
        this.address1Service.loadMoreAddresses(this.getQueryParams(true))
            .then((promise) => {
                this.addresses = this.addresses.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    searchAddresses() {
        this.loading = true;
        this.address1Service.searchAddresses(this.getQueryParams())
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

    editAddress1(address) {
        var modalInstance = this.modal.open({
            animation: true,
            templateUrl: 'app/addresses/address1/address1Modal.html',
            controller: 'Address1EditModalController as vm',
            size: 'md',
            resolve: {
                address: function () {
                    return address;
                }
            }
        });
        modalInstance.result.then((address) => {
            this.address1Service.saveAddress(address)
                .then(() => {
                    this.getAddresses();
                });
        });
    }

    deleteAddress1(address) {
        var modalInstance = this.modal.open({
            animation: true,
            templateUrl: 'app/addresses/address1/address1DeleteModal.html',
            controller: 'Address1DeleteModalController as delCtrl',
            size: 'md',
            resolve: {
                address: function () {
                    return address;
                }
            }
        });
        modalInstance.result.then((address) => {
            this.address1Service.saveAddress(address)
                .then(() => {
                    this.getAddresses();
                });
        });
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }
}

export default Address1Controller;
