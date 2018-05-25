import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';

export class IrfIndiaController {
    constructor() {
        'ngInject';

        this.selectedStep = 1;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate
        ];
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};