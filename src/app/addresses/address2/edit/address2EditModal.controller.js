class Address2EditModalController {
    constructor($uibModalInstance, address, $scope, address2Service, address1Service, $state) {
        'ngInject';

        this.address2Service = address2Service;
        this.address1Service = address1Service;

        this.modalInstance = $uibModalInstance;
        this.state = $state;
        this.scope = $scope;
        this.scope.address = angular.copy(address);
    }

    save() {
        // this is so we can save null cannon names
        if (this.scope.address.canonical_name === "" || this.scope.address.canonical_name === undefined || this.scope.address.canonical_name === null) {
            this.scope.address.canonical_name = { id: -1, name: "Empty" };
        }
        this.modalInstance.close(this.scope.address);
    }

    cancel() {
        this.state.go('address2', {editId: null}, {notify: false});

        this.modalInstance.dismiss('close');
    }

    getFuzzyAddress1s(val) {
        return this.address1Service.getFuzzyAddress1s(val)
            .then((promise) => {
                return promise.data;
            });
    }

    getFuzzyAddress2s(val) {
        return this.address2Service.getFuzzyAddress2s(val)
            .then((promise) => {
                return promise.data;
            });
    }
}
export default Address2EditModalController;
