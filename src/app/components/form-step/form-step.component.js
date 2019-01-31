import formStepTemplateUrl from './form-step.html';
import './form-step.less';

export class FormStepController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
    }

    $onInit() {
    	if (!isNaN(parseInt(this.blueFlag))) {
    		this.redFlag = this.blueFlag;
    	}
        if (!isNaN(parseInt(this.redFlag))) {
            this.$scope.$watch(
                () => this.responseValue,
                (newValue, oldValue) => {
                    this.setFlagSend(newValue, oldValue);
                }
            );
        }
        this.setOtherQuestionValues();
    }

    clickRadio() {
        if (this.otherValue !== undefined && this.responseValue !== 'Other') {
            this.otherValue = '';
        }
    }

    clickRadioLabel($event) {
        $event.preventDefault();
        if (this.responseValue === this.label) {
            this.responseValue = '';
        } else {
            this.responseValue = this.label;
        }
        if (this.otherValue !== undefined && this.responseValue !== 'Other') {
            this.otherValue = '';
        }
    }

    changeRadioOther() {
        if (this.otherValue !== undefined && this.otherValue !== '') {
            this.responseValue = 'Other';
        }
    }

    emitFlag(amountToAdd) {
        this.$scope.$emit('flagTotalCheck', {
            numberOfFlagsToAdd: amountToAdd,
        });
    }

    setFlagSend(newValue, oldValue) {
        if (this.type === 'radio' || this.type === 'otherRadio') {
            if (newValue) {
                if (newValue === this.label) {
                    this.emitFlag(this.redFlag);
                } else if (oldValue === this.label) {
                    this.emitFlag(-this.redFlag);
                }
            } else if (oldValue && !newValue) {
                this.emitFlag(-this.redFlag);
            }
        } else {
           if (!oldValue && newValue) {
               this.emitFlag(this.redFlag);
           } else if (oldValue && !newValue) {
               this.emitFlag(-this.redFlag);
           }
        }
    }

    setOtherQuestionValues() {
        if (this.type === 'otherCheckbox') {
            let valueSet = this.responseValue;
            this.responseValue = valueSet || '';
            this.otherValue = !!valueSet;
        }
    }
    
    updateCheckboxOther(event) {
        var checkbox = event.target;
        if (!checkbox.checked) {
            this.responseValue = '';
        }
        
    }
}

export default {
    bindings: {
        inputClass: '@',
        label: '@',
        otherValue: '=?',
        radioName: '@',
        checkboxName: '@',
        redFlag: '<?',
        blueFlag: '<?',
        responseValue: '=?',
        stepLabel: '<',
        type: '@',
    },
    controller: FormStepController,
    templateUrl: formStepTemplateUrl,
    transclude: true,
};
