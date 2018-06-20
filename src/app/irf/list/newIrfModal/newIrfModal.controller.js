export default class NewIrfModalController {
    constructor($uibModalInstance) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
    }

    close() {
        this.$uibModalInstance.close();
    }

    createNewIrf(countryIrfSelected) {
        this.$state.go(countryIrfSelected);
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }
}