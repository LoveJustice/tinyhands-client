import {BaseIrfController} from '../baseIrfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './uganda.less';

import templateUrl from './uganda.html';
import topBoxTemplate from '../common/step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from '../common/step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import attachmentsTemplate from '../common/step-templates/attachments/attachment.html';
import logbookTemplate from '../common/step-templates/logbook.html';

import IntercepteeModalController from '../intercepteeModal.controller';
import intercepteeModalTemplate from '../common/step-templates/interceptees/intercepteePassportModal.html';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class IrfUgandaController extends BaseIrfController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService);
        
        this.stepTemplates = [
        	topBoxTemplate,
        	groupTemplate,
        	destinationTemplate,
        	familyTemplate,
        	signsTemplate,
        	intercepteesTemplate,
        	finalProceduresTemplate,
            attachmentsTemplate,
            logbookTemplate
        ];
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport', 'ID#'];
    }

    openIntercepteeModal(card, isAdd = false, idx = null) {
    	this.commonModal(card, isAdd, idx, IntercepteeModalController,'IntercepteeModalController',
    			intercepteeModalTemplate, 'Interceptees', {identificationTypes:this.getDefaultIdentificationTypes()});
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