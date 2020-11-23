import {BaseLegalCaseController} from '../baseLegalCaseController.js';
import {BaseModalController} from '../../baseModalController.js';
import {LegalCaseModalController} from '../legalCaseModalController.js';
import './common.less';

const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from './common.html';
import legalCaseTemplate from './step-templates/legalCase.html';
import suspectsTemplate from './step-templates/suspects/suspect.html';
import victimsTemplate from './step-templates/victims/victim.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import suspectTemplate from './step-templates/suspects/suspectModal.html';
import victimTemplate from './step-templates/victims/victimModal.html';
import attachmentTemplate from './step-templates/attachments/attachmentModal.html';

export class LegalCaseCommonController extends BaseLegalCaseController {
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService) {
        'ngInject';        
        super($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService);
       
        this.stepTemplates = [
            legalCaseTemplate,
            suspectsTemplate,
            suspectsTemplate,
            attachmentsTemplate
        ];
        
        this.stepTemplates = [
            {template:legalCaseTemplate, name:"Legal Case"},
            {template:suspectsTemplate, name:"Suspects"},
            {template:victimsTemplate, name:"Victims"},
            {template:attachmentsTemplate, name:"Attachments"},
        ];
        
        this.checkboxGroup = new CheckboxGroup();
        this.caseTypes = [
            'Human Trafficking',
            'Rape',
            'Public Case',
            'Foreign Employment',
            'Assault',
            'Child Marriage',
            'Domestic Violence',
            'Forced Labor',
            'Forgery',
            'Gang Rape',
            'Illegal Detention',
            'Kidnapping',
            'Multiple Marriage',
            'Sexual Harassment',
            'Taking Passport Abroad',
            'Cyber Crime'
        ];
        for (let idx=0; idx < this.caseTypes.length; idx++) {
            this.checkboxGroup.checkboxItem(1008, this.caseTypes[idx]);
        }
    }
    
    getSubIrfComplete() {
        this.checkboxGroup.initOriginalValues(this.questions);
    }
    
    submitExtra() {
        this.checkboxGroup.updateResponses();
    }
    
    openSuspectModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseModalController, 'SuspectModalController',
                suspectTemplate, 'Suspects');
    }
        
    openVictimModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'VictimModalController',
                victimTemplate, 'Victims');
    }

    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: LegalCaseCommonController
};
