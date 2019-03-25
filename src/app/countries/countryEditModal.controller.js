class CountryModalController {
    constructor($uibModalInstance, country, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.country = angular.copy(country);
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
