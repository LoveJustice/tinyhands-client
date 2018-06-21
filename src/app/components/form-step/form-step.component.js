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
        if (this.type === 'otherCheckbox') {
            this.otherValue = this.setOtherQuestionValues();
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
        label: '<?',
        otherValue: '<?',
        radioName: '<?',
        redFlag: '<?',
        responseValue: '<?',
        stepLabel: '<',
        type: '<?',

    },
    controller: FormStepController,
    templateUrl: formStepTemplateUrl,
    transclude: true
};