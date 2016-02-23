export default class AccountModalController {
  constructor($scope, $uibModalInstance, user_name) {
    
    this.user_name = user_name
    this.modalInstance = $uibModalInstance
  }

  delete() {
    this.modalInstance.close(true);
  };

  cancel() {
    this.modalInstance.dismiss("cancel");
  };
}