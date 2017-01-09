class Address1EditModalController {
    constructor($uibModalInstance, address, $scope, $state) {
        'ngInject';

        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.state = $state;
        this.scope.address = angular.copy(address);
    }

    save() {
        this.state.go('address1', {editId: null}, {notify: false});
        this.modalInstance.close(this.scope.address);
    }

    cancel() {
        this.state.go('address1', {editId: null}, {notify: false});
        this.modalInstance.dismiss('close');
    }
}
export default Address1EditModalController;
