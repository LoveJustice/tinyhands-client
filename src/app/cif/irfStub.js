import {BaseIrfController} from '../irf/baseIrfController.js';

export class IrfStubController extends BaseIrfController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, cifController) {
        super($scope, $uibModal, constants, IrfService, $stateParams, $state);
        
        this.cifController = cifController;
    }
    
    // Override to be triggered on complete retrieval of IRF
    getIrfComplete() {
        if (this.cifController) {
            this.cifController.getIrfComplete();
        }
    }
    
    getIntercepteeCards(intercepteeType) {
        let intercepteeList = [];
        let interceptees = this.getCardInstances('Interceptees');
        for (let idx=0; idx < interceptees.length; idx++) {
            let cardQuestions = _.keyBy(interceptees[idx].responses, (x) => x.question_id);
            if (cardQuestions[8].response.value === intercepteeType) {
                intercepteeList.push(interceptees[idx]);
            }
        }
        return intercepteeList;
    }
    
    getIntercepteePersons(intercepteeType) {
        let personList = [];
        let interceptees = this.getIntercepteeCards(intercepteeType);
        for (let idx=0; idx < interceptees.length; idx++) {
            let cardQuestions = _.keyBy(interceptees[idx].responses, (x) => x.question_id);
            personList.push(cardQuestions[9].response);
        }
        return personList;
    }
}