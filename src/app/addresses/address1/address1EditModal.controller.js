class Address1EditModalController {
    constructor($uibModalInstance, address, $scope) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.address = angular.copy(address);
    }

    save() {
        this.modalInstance.close(this.scope.address);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default Address1EditModalController;
