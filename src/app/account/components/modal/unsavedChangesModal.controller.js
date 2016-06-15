export default class UnsavedChangesModalController {
    constructor($uibModalInstance) {

        this.$uibModalInstance = $uibModalInstance;
    }

    saveAndContinue() {
        this.$uibModalInstance.close(true);
    }

    discardAndContinue() {
        this.$uibModalInstance.close(false);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
}
