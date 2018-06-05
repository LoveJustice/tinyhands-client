import formStepTemplateUrl from './form-step.html';
import './form-step.less';

export class FormStepController {
    constructor() {
        'ngInject';
    }
}

export default {
    bindings: {
        redFlag: '<?',
        stepLabel: '<'
    },
    controller: FormStepController,
    templateUrl: formStepTemplateUrl,
    transclude: true
};