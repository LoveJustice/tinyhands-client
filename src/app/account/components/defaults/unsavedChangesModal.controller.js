export default class UnsavedChangesModalController {
  constructor($scope, $uibModalInstance) {

    this.$uibModalInstance = $uibModalInstance;
  }

  saveAndContinue() {
    this.$uibModalInstance.close('save');
  };

  discardAndContinue() {
    this.$uibModalInstance.close('discard');
  }

  cancel() {
    this.$uibModalInstance.dismiss("cancel");
  };
}