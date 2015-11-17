class Address2Controller {
    constructor($rootScope, $scope, $http, $timeout, address2Service, $uibModal) {
        'ngInject';

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

        this.getAddresses();
    }

    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "latitude":
                case "longitude":
                    return this.reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "name":
                case "cannonical_name.name":
                case "district.name":
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
            .success((data) => {
                this.addresses = data.results;

                var nextURL = data.next.split('/');
                nextURL = nextURL[nextURL.length - 1];

                this.nextPageUrl = nextURL;
                this.loading = false;
            });
    }

    loadMoreAddresses() {
        this.loading = true;
        this.address2Service.loadMoreAddresses(this.nextPageUrl, "&" + this.getQueryParams().slice(1))
            .success((data) => {
                this.addresses = this.addresses.concat(data.results);

                var nextURL = data.next.split('/');
                nextURL = nextURL[nextURL.length - 1];

                this.nextPageUrl = nextURL;
                this.loading = false;
            });
    }

    searchAddresses() {
        this.loading = true;
        this.address2Service.searchAddresses(this.getQueryParams())
            .success((data) => {
                this.addresses = data.results;
                this.nextPageUrl = data.next;
                this.loading = false;
            });
    }

    getQueryParams() {
        var params = [];
        params.push({"name": "page_size", "value": this.paginateBy});
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

    editAddress2(address){
        this.selectedAddress = address;
        var size = 'md';
        var modalInstance = this.modal.open({
          animation: true,
          templateUrl: 'address2EditModal.html',
          controller: 'Address2EditModalController as vm',
          size: size,
          resolve: {
            address: function () {
                return address;
            }
          }
        });
        modalInstance.result.then((address) => {
            this.address2Service.saveAddress(address)
                .success(() => {
                    this.getAddresses();
                });
        });

    }
}

export default Address2Controller;

