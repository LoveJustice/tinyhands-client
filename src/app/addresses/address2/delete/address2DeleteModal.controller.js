class Address2DeleteModalController {
    constructor($uibModalInstance, address, $scope, address2Service, $state) {
        'ngInject';

        this.service = address2Service;
        this.modalInstance = $uibModalInstance;
        this.state = $state;
        this.scope = $scope;
        this.scope.address = angular.copy(address);
        this.address = angular.copy(address);

        this.canDelete = false;

        this.getAddressRelatedItems();
    }

    getAddressRelatedItems() {
        this.service.getRelatedItems(this.address).then((promise) => {
            this.related_items = promise.data.related_items;
            this.updateCanDelete();
        });
    }


    updateCanDelete() {
        var count = 0;
        this.related_items.forEach((riCategory) => {
            riCategory.objects.forEach((riItem) => {
                count += 1;
            })
        })
        this.canDelete = count == 0;
    }

    getUisrefForIdAndType(obj, type) {
        this.modalInstance.close('close');
        switch (type) {
            case "address2":
                this.state.go('address2', {deleteId: obj.id})
                break;
            case "victiminterview":
            case "victiminterviewlocationbox":
                this.state.go('vifList', {search: obj.name})
                break;
        }
    }

    showMore(item) {
        item.limit += 10;
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

    cancel() {
        this.state.go('address2', {deleteId: null}, {notify: false});
        this.modalInstance.dismiss('close');
    }

    delete() {
        if (!this.confirm) {
            return this.confirm = !this.confirm;
        } else {
            this.service.deleteAddress(this.address.id).then((response) => {
                this.toastr.success("Address successfully deleted!")
                this.state.go('address2', {deleteId: null}, {notify: false});
                this.modalInstance.dismiss('close');
                this.state.reload();
            },
            (response) => {
                this.toastr.error("Address failed to be deleted!")
            });
        }
    }

    swapAndDelete() {
        if (!this.confirmSwap) {
            return this.confirmSwap = !this.confirmSwap;
        } else {
            this.service.swapAddresses(this.address.id, this.addressToSwapWith.id).then((response) => {
                this.modalInstance.dismiss('close');
                this.state.reload();
                this.toastr.success("Addresses successfully swapped and deleted!")
            },
            () => {
                this.toastr.error("Address swapping failed!")
            });
        }
    }
}
export default Address2DeleteModalController;
