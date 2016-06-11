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
            if (this.scope.ngModel.value === true) {
                this.root.flags += this.scope.ngModel.weight;
            } else {
                this.root.flags -= this.scope.ngModel.weight;
            }
            if (this.root.flags < 0) {
                this.root.flags = 0;
            }
        }
    }
}