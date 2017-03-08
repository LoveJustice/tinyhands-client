class CountryEditModalController {
    constructor($uibModalInstance, country, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.country = angular.copy(country);
    }

    save() {
        this.modalInstance.close(this.scope.country);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default CountryEditModalController;
