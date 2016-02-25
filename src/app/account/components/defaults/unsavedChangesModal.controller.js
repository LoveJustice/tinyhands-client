export default class UnsavedChangesModalController {
  constructor($scope, $uibModalInstance) {

    this.$uibModalInstance = $uibModalInstance;
  }

  saveAndContinue() {
    this.$uibModalInstance.close(true);
  };

  cancel() {
    this.$uibModalInstance.dismiss("cancel");
  };
}