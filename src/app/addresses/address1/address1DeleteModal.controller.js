class Address1DeleteModalController {
    constructor($uibModalInstance, address, $scope, address1Service, $state, toastr) {
        'ngInject';

        this.state = $state;
        this.service = address1Service;
        this.modalInstance = $uibModalInstance;
        this.confirm = false;
        this.scope = $scope;
        this.toastr = toastr;

        this.address = angular.copy(address);
        this.scope.address = angular.copy(address);

        this.canDelete = false;
        this.getAddressRelatedItems();
        this.limit = 5;
        this.swapTooltip = 'Swapping with another Address 1 will associate all of the related items to the selected Address and delete the Address you have selected to delete.';
    }

    swapAndDelete() {
        if (!this.confirm) {
            return this.confirm = !this.confirm;
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

    showMore(item) {
        item.limit += 10;
    }

    getAddressRelatedItems() {
        this.service.getRelatedItems(this.scope.address).then((promise) => {
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
        if (!this.confirm) {
            return this.confirm = !this.confirm;
        } else {
            this.service.deleteAddress(this.address.id).then((response) => {
                this.toastr.success("Address successfully deleted!")
                this.state.go('address1', {deleteId: null}, {notify: false});
                this.modalInstance.dismiss('close');
                this.state.reload();
            },
            (response) => {
                this.toastr.error("Address failed to be delete!")
            });
        }
    }

    cancel() {
        this.state.go('address1', {deleteId: null}, {notify: false});
        this.modalInstance.dismiss('close');
    }
}
export default Address1DeleteModalController;