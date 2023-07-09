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
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService, IncidentService) {
        'ngInject';        
        super($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService, IncidentService);
       
        this.stepTemplates = [
            legalCaseTemplate,
            timelineTemplate,
            suspectsTemplate,
            suspectsTemplate,
            attachmentsTemplate
        ];
        
        this.stepTemplates = [
            {template:legalCaseTemplate, name:"Basic Case Details"},
            {template:timelineTemplate, name:"Timeline"},
            {template:suspectsTemplate, name:"Suspects"},
            {template:victimsTemplate, name:"Victims"},
            {template:attachmentsTemplate, name:"Attachments"},
        ];
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.countryCharges = {
                1:[ //Nepal
                    {'name':'Human Trafficking and Transportation (Control) Act (2064)', 'format':'col-md-6'},
                    {'name':'Civil Criminal Procedure Code 2074', 'format':'col-md-6'},
                    {'name':'Domestic Violence and Punishment Act 2066', 'format':'col-md-6'},
                    {'name':'Foreign Employment Act 2064', 'format':'col-md-6'},
                ],  
           };
        
        this.charges = [];
        if (this.stateParams.countryId in this.countryCharges) {
            this.charges = this.countryCharges[this.stateParams.countryId];
        }
        for (let idx=0; idx < this.charges.length; idx++) {
            this.checkboxGroup.checkboxItem(1040, this.charges[idx].name);
        }
    }
    
    getLegalCaseComplete() {
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
