export default class FlagController {
  constructor($rootScope, $scope) {
    'ngInject';

    this.root = $rootScope;
    this.scope = $scope;
  }

  checkboxValueChange() {
    if (!this.root.flags) {
      this.root.flags = 0;
    }
    if (this.root.flags < 50) {
      this.root.flags += 1;
    }
  }
}