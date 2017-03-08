class CountryAddModalController {
    constructor($uibModalInstance, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
    }

    save() {
        this.modalInstance.close(this.scope.country);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default CountryAddModalController;
