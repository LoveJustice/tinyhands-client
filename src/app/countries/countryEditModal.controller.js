class CountryModalController {
    constructor($uibModalInstance, country, regions, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.regions = reginos;
        this.scope.country = angular.copy(country);
        if (this.scope.country && this.scope.country.region) {
            this.scope.country.region = '' + this.scope.country.region;
        }
    }

    save() {
        //this.scope.country.currency = escape(this.scope.country.currency);
        alert(this.scope.country.currency);
        this.modalInstance.close(this.scope.country);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default CountryModalController;
