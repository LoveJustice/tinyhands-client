import formStepTemplateUrl from './form-step.html';
import './form-step.less';

export class FormStepController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
    }

    $onInit() {
        this.$scope.$watch(() => this.responseValue, (newValue, oldValue) => {
            this.setFlagSend(newValue, oldValue);
        });

    }

    emitFlag(amountToAdd) {
        this.$scope.$emit('flagTotalCheck', {
            numberOfFlagsToAdd: amountToAdd
        });
    }

    setFlagSend(newValue, oldValue) {
        if ((oldValue && newValue) || (!oldValue && newValue)) {
            this.emitFlag(this.redFlag);
        } else if (oldValue && !newValue) {
            this.emitFlag(-this.redFlag);
        }
    }
}

export default {
    bindings: {
        redFlag: '<?',
        responseValue: '<?',
        stepLabel: '<',
        label: '<?',
        type: '<?',
        otherValue: '<?'
    },
    controller: FormStepController,
    templateUrl: formStepTemplateUrl,
    transclude: true
};