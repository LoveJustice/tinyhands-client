class Address2DeleteModalController {
    constructor($uibModalInstance, address, $scope, address2Service, $state) {
        'ngInject';

        this.state = $state;
        this.service = address2Service;
        this.modalInstance = $uibModalInstance;
        this.scope = $scope;
        this.scope.address = angular.copy(address);

        this.scope.canDelete = true;

        this.getAddressRelatedItems();
    }

    getAddressRelatedItems() {
        this.service.getRelatedItems(this.scope.address).then((promise) => {
            this.related_items = promise.data.related_items;

            this.canDelete = true;
            this.related_items.forEach((arr) => {
                this.canDelete = this.canDelete && arr.ids.length == 0;
            });
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
            case "canonical_name":
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
export default Address2DeleteModalController;
