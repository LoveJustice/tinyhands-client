class CountryModalController {
    constructor($uibModalInstance, country, regions, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.regions = regions;
        this.scope.country = angular.copy(country);
        if (this.scope.country && this.scope.country.region) {
            this.scope.country.region = '' + this.scope.country.region;
        }
        if (this.scope.country && this.scope.country.currency) {
            this.scope.country.currency = decodeURI(this.scope.country.currency);
        }
    }

    save() {
        this.scope.country.currency = encodeURI(this.scope.country.currency);
        this.modalInstance.close(this.scope.country);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default CountryModalController;
