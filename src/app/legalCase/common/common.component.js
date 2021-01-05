import {BaseLegalCaseController} from '../baseLegalCaseController.js';
import {BaseModalController} from '../../baseModalController.js';
import {LegalCaseModalController} from '../legalCaseModalController.js';
import './common.less';

const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from './common.html';
import legalCaseTemplate from './step-templates/legalCase.html';
import timelineTemplate from './step-templates/timeline/timeline.html';
import suspectsTemplate from './step-templates/suspects/suspect.html';
import victimsTemplate from './step-templates/victims/victim.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import timelineEntryTemplate from './step-templates/timeline/timelineModal.html';
import suspectTemplate from './step-templates/suspects/suspectModal.html';
import victimTemplate from './step-templates/victims/victimModal.html';
import attachmentTemplate from './step-templates/attachments/attachmentModal.html';

export class LegalCaseCommonController extends BaseLegalCaseController {
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService) {
        'ngInject';        
        super($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService);
       
        this.stepTemplates = [
            legalCaseTemplate,
            timelineTemplate,
            suspectsTemplate,
            suspectsTemplate,
            attachmentsTemplate
        ];
        
        this.stepTemplates = [
            {template:legalCaseTemplate, name:"Legal Case"},
            {template:timelineTemplate, name:"Timeline"},
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
    
    openTimelineModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseModalController, 'TimelineModalController',
                timelineEntryTemplate, 'Timeline');
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
