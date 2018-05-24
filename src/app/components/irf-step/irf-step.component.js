import irfStepTemplateUrl from './irf-step.html';
import './irf-step.less';

export class IrfStepController {
    constructor() {
        'ngInject';
    }
}

export default {
    bindings: {
        redFlag: '<?',
        stepLabel: '<'
    },
    controller: IrfStepController,
    templateUrl: irfStepTemplateUrl,
    transclude: true
};