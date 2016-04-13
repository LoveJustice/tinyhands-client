export default class CheckBoxController {
  constructor($rootScope, $scope) {
    'ngInject';

    this.root = $rootScope;
    this.scope = $scope;
  }

  checkboxValueChange() {
    if (this.scope.isFlag) {
      if (!this.root.flags) {
        this.root.flags = 0;
      }
      if (this.root.flags < 50) {
        this.root.flags += 1;
      }
    }
  }
}