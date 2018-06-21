import formStepTemplateUrl from './form-step.html';
import './form-step.less';

export class FormStepController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;

        this.otherIsTrue = false;
    }

    $onInit() {
        this.$scope.$watch(() => this.responseValue, (newValue, oldValue) => {
            this.setFlagSend(newValue, oldValue);
        });
        if (this.type === 'otherCheckbox') {
            this.otherIsTrue = this.setOtherQuestionValues();
        }
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

    setOtherQuestionValues() {
        let valueSet = this.responseValue;
        this.responseValue = valueSet || '';
        return !!valueSet;
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