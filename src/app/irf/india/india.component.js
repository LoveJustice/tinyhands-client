import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';


export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.service = IndiaService;

        this.selectedStep = 0;
        this.stepTemplates = [
            topBoxTemplate
        ];
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};