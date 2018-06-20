export default class newIrfModalController {
    constructor($uibModalInstance) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;

    }

    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }
}