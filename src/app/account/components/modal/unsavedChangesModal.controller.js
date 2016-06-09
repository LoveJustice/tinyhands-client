import Constants from './../../constants.js';

export default class UnsavedChangesModalController {
    constructor($scope, $uibModalInstance) {

        this.$uibModalInstance = $uibModalInstance;
    }

    saveAndContinue() {
        this.$uibModalInstance.close(Constants.unsavedChangesModalOptions.save);
    }

    discardAndContinue() {
        this.$uibModalInstance.close(Constants.unsavedChangesModalOptions.discard);
    }

    cancel() {
        this.$uibModalInstance.dismiss(Constants.unsavedChangesModalOptions.cancel);
    }
}
