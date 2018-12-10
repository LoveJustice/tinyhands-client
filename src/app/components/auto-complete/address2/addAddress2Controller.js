export default class AddAddress2Controller {
    constructor($uibModal, $uibModalInstance, $scope, address1Service, address2Service, address1, address2Name) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.address = {
                address1:address1,
                name:address2Name,
                latitude:0,
                longitude:0,
                level:'',
                verified:false
        };
        this.address1Service = address1Service;
        this.address2Service = address2Service;
        this.address1Disabled = address1;
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
    
    save() {
        if (this.scope.address.canonical_name === "" || this.scope.address.canonical_name === undefined || this.scope.address.canonical_name === null) {
            this.scope.address.canonical_name = { id: -1, name: "Empty" };
        }
        this.address2Service.addAddress(this.scope.address)
        .then((response) => {
             this.$uibModalInstance.close(response.data);
        });
    }
    
    cancel() {
        this.$uibModalInstance.dismiss();
    }
}