export default class AccountModalController {
  constructor($scope, $uibModalInstance, user_name) {

    if (user_name == '') {
      this.name = 'Empty';
    } else {
      this.name = user_name;
    }
    this.$uibModalInstance = $uibModalInstance;
  }

  delete() {
    this.$uibModalInstance.close(true);
  };

  cancel() {
    this.$uibModalInstance.dismiss("cancel");
  };
}