import {BaseIrfController} from '../baseIrfController.js';
import './nepal.less';

import templateUrl from './nepal.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';

import IntercepteeModalController from '../intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';

export class IrfNepalController extends BaseIrfController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state);
        
        this.stepTemplates = [
        	topBoxTemplate,
        	groupTemplate,
        	destinationTemplate,
        	familyTemplate,
        	signsTemplate,
        	intercepteesTemplate,
        	finalProceduresTemplate
        ];
    }

    openIntercepteeModal(card, isAdd = false, idx = null) {
    	this.commonModal(card, isAdd, idx, IntercepteeModalController,'IntercepteeModalController',
    			intercepteeModalTemplate, 'Interceptees');
    }
}
export default {
    templateUrl,
    controller: IrfNepalController,
};