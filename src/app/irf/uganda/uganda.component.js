import {BaseIrfController} from '../baseIrfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './uganda.less';

import templateUrl from './uganda.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import IntercepteeModalController from '../intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';
import attachmentTemplate from './step-templates/attachments/attachmentModal.html';

export class IrfUgandaController extends BaseIrfController {
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
        	finalProceduresTemplate,
            attachmentsTemplate
        ];
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport'];
    }

    openIntercepteeModal(card, isAdd = false, idx = null) {
    	this.commonModal(card, isAdd, idx, IntercepteeModalController,'IntercepteeModalController',
    			intercepteeModalTemplate, 'Interceptees');
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: IrfUgandaController,
};