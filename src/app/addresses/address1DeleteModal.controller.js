class Address1DeleteModalController {
    constructor($uibModalInstance, address, $scope, address1Service, $state) {
        'ngInject';

        this.state = $state;
        this.service = address1Service;
        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.address = angular.copy(address);

        this.scope.canDelete = true;

        this.getAddressRelatedItems();
    }

    getAddressRelatedItems() {
        this.service.getRelatedItems(this.scope.address).then((promise) => {
            this.related_items = promise.data.related_items;
            console.log(this.related_items);
        });
    }

    getUisrefForIdAndType(id, type) {
        this.modalInstance.close('close');
        this.state.go('address2')
    }

    delete() {
        this.modalInstance.close(this.scope.address);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default Address1DeleteModalController;
