import {BaseLegalCaseController} from '../baseLegalCaseController.js';
import {BaseModalController} from '../../baseModalController.js';
import {LegalCaseTimelineModalController} from '../legalCaseTimelineModalController.js';
import {LegalCaseVictimModalController} from '../legalCaseVictimModalController.js';
import {LegalCaseSuspectModalController} from '../legalCaseSuspectModalController.js';
import './common.less';

import templateUrl from './common.html';
import legalCaseTemplate from './step-templates/legalCase.html';
import timelineTemplate from './step-templates/timeline/timeline.html';
import suspectsTemplate from './step-templates/suspects/suspect.html';
import victimsTemplate from './step-templates/victims/victim.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';
import verificationsTemplate from './step-templates/verification/verification.html';

import timelineEntryTemplate from './step-templates/timeline/timelineModal.html';
import suspectTemplate from './step-templates/suspects/suspectModal.html';
import victimTemplate from './step-templates/victims/victimModal.html';
import attachmentTemplate from './step-templates/attachments/attachmentModal.html';
import verificationTemplate from './step-templates/verification/verificationModal.html';

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
            {template:legalCaseTemplate, name:"Details"},
            {template:suspectsTemplate, name:"Suspects"},
            {template:victimsTemplate, name:"Victims"},
            {template:timelineTemplate, name:"Timeline"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:verificationsTemplate, name:"Verification"},
        ];
    }
    
    addRemoveVerification(shouldVerify) {
   		let found = -1;
    	for (let idx in this.stepTemplates) {
    		if (this.stepTemplates[idx].name === 'Verification') {
    			found = idx;
    			break;
    		}
    	}
    	if (shouldVerify) {
    		if (!found === -1) {
    			this.stepTemplates.push({template:verificationsTemplate, name:"Verification"});
    		}
    	} else {
    		if (found > -1) {
    			this.stepTemplates.splice(found, 1);
    		}
    	}
    }
    
    openTimelineModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseTimelineModalController, 'TimelineModalController',
                timelineEntryTemplate, 'Timeline');
    }
    
    openSuspectModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseSuspectModalController, 'SuspectModalController',
                suspectTemplate, 'Suspects');
    }
        
    openVictimModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseVictimModalController, 'VictimModalController',
                victimTemplate, 'Victims');
    }

    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
    openVerificationModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, LegalCaseSuspectModalController, 'VerificationModalController',
                verificationTemplate, 'Suspects');
    }
}

export default {
    templateUrl,
    controller: LegalCaseCommonController
};
