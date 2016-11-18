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
        if (type === "address2"){
            this.state.go('address2', {deleteId: id})
        }

    }

    getPrettyTypeName(item) {
        let name = "";
        switch (item.type) {
            case "address2":
                name = "Address 2";
                break;
            case "person":
                name = "Person";
                break;
            case "victiminterview":
                name = "VIF";
                break;
            case "victiminterviewlocationbox":
                name = "Victim Interview Location Box";
        }
        return name;
    }

    delete() {
        this.modalInstance.close(this.scope.address);
    }

    cancel() {
        this.modalInstance.dismiss('close');
    }
}
export default Address1DeleteModalController;
