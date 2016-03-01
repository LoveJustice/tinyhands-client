class Address1Controller {
    constructor($rootScope, $scope, $http, $timeout, address1Service, $uibModal) {
        'ngInject';

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

        this.getAddresses();
    }

    sortIcon() {
        return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
    }

    getAddresses() {
        this.loading = true;
        this.address1Service.listAddresses(this.getQueryParams())
            .success((data) => {
                this.addresses = data.results;
                this.nextPageUrl = this.nextUrl(data.next);
                this.loading = false;
            });
    }

    loadMoreAddresses() {
        this.loading = true;
        this.address1Service.loadMoreAddresses(this.getQueryParams(true))
            .success((data) => {
                this.addresses = this.addresses.concat(data.results);
                this.nextPageUrl = this.nextUrl(data.next);
                this.loading = false;
            });
    }

    searchAddresses() {
        this.loading = true;
        this.address1Service.searchAddresses(this.getQueryParams())
            .success((data) => {
                this.addresses = data.results;
                this.nextPageUrl = this.nextUrl(data.next);
                this.loading = false;
            });
    }

    getQueryParams(loadMore=false) {
        var params = [];
        params.push({"name": "page_size", "value": this.paginateBy});
        if (this.nextPageUrl && loadMore) {
            params.push({"name": "page", "value": this.nextPageUrl});
        }
        if (this.searchValue) {
            params.push({"name": "search", "value": this.searchValue});
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({"name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__"))});
            } else {
                params.push({"name": "ordering", "value": (this.sortColumn.replace(".", "__"))});
            }
        }
        return params;
    }

    editAddress1(address){
        var modalInstance = this.modal.open({
          animation: true,
          templateUrl: 'app/addresses/address1Modal.html',
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
                .success(() => {
                    this.getAddresses();
                });
        });
    }

    nextUrl(url){
        if(url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }
}

export default Address1Controller;

