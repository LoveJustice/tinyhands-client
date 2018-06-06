import formStepTemplateUrl from './form-step.html';
import './form-step.less';

export class FormStepController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
    }

    $onInit() {
        this.$scope.$watch(() => this.responseValue, (newValue, oldValue) => {
            if (oldValue === newValue) {
                this.emitFlag(true);
            } else {
                this.emitFlag(false);
            }
        });
    }

    emitFlag(initializing) {
        this.$scope.$emit('flagTotalCheck', {
            flagNum: this.redFlag,
            flagValue: this.responseValue,
            flagInitializing: initializing
        });
    }
}

export default {
    bindings: {
        redFlag: '<?',
        responseValue: '<?',
        stepLabel: '<'
    },
    controller: FormStepController,
    templateUrl: formStepTemplateUrl,
    transclude: true
};