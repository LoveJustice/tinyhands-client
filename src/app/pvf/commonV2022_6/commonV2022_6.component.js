import {BasePvfController} from '../basePvfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './commonV2022_6.less';
import CheckboxGroup from '../../checkboxGroup';

import templateUrl from './commonV2022_6.html?url';

import topTemplate from './step-templates/top.html?url';
import pvFamilyTemplate from './step-templates/pv-family.html?url';
import recruitmentTemplate from './step-templates/recruitment.html?url';
import travelTemplate from './step-templates/travel-prior-exploitation.html?url';
import homeAssessmentTemplate from './step-templates/home-assessment.html?url';
import awarenessTemplate from './step-templates/awareness.html?url';
import releaseTemplate from './step-templates/release.html?url';
import staffAssessmentTemplate from './step-templates/staff-assessment.html?url';
import attachmentsTemplate from './step-templates/attachments/attachment.html?url';
import complianceTemplate from './step-templates/compliance.html?url';

import attachmentTemplate from './step-templates/attachments/attachment-modal.html?url';

export class PvfCommonV2022_6Controller extends BasePvfController {
    constructor($scope, $uibModal, constants, PvfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService) {
        'ngInject';        
        super($scope, $uibModal, constants, PvfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService);

        this.stepTemplates = [
            {template:topTemplate,name:'Top Box'},
            {template:pvFamilyTemplate,name:'PV/Family Info'},
            {template:recruitmentTemplate,name:'Recruitment'},
            {template:travelTemplate,name:'Travel & Prior Exploitation'},
            {template:homeAssessmentTemplate,name:'Home Situation Assessment'},
            {template:awarenessTemplate,name:'Awareness'},
            {template:releaseTemplate,name:'Release Info'},
            {template:staffAssessmentTemplate,name:'Staff Assessment'},
            {template:attachmentsTemplate,name:'Attachments'},
            {template:complianceTemplate, name:'Compliance'}
        ];
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.howRecruited = [
            {
                value:'Promised a job',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Promised marriage',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Approached at work',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Online job advertisement',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Met suspect online',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Suspect approached directly',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Through friends',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Through family',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Suspect called PV's mobile",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:'Other',
                type:'other-checkbox-group',
                format:'col-md-4',
                points:0
            },
        ];
        
        for (let idx in this.howRecruited) {
        	if (this.howRecruited[idx].type === 'checkbox-group') {
        		this.checkboxGroup.checkboxItem('pvfRecruitmentHowRecruited', this.howRecruited[idx].value);
        	}
        }
        
        this.howExpensesPaid = [
        	{
                label:"The PV paid:",
                value:"The PV paid to broker",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                label:"The PV paid themselves",
                value:"The PV paid themselves",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
            	label:"Suspect paid all expenses",
            	value:"Suspect paid all expenses",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
            	label:"Suspect paid",
                value:"Suspect paid which must be repaid",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
        ];
        
        for (let idx in this.howExpensesPaid) {
        	if (this.howExpensesPaid[idx].type === 'checkbox-group') {
        		this.checkboxGroup.checkboxItem('pvfRecruitmentTravelExpenses', this.howExpensesPaid[idx].value);
        	}
        }
        
        this.howPvTravel = [
        	{
                value:"Bus",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            {
                value:"Train",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            {
                value:"Private Vehicle",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            {
                value:"Airplane",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            {
                value:"Foot",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            {
                value:'Other',
                type:'other-checkbox-group',
                format:'col-md-4',
                points:0
            }
        ];
        for (let idx in this.howPvTravel) {
        	if (this.howPvTravel[idx].type === 'checkbox-group') {
        		this.checkboxGroup.checkboxItem('pvfTravelHow', this.howPvTravel[idx].value);
        	}
        }
    }
    
    getPvfComplete() {
        this.checkboxGroup.initOriginalValues(this.questions);
    }
    
    saveExtra() {
        this.checkboxGroup.updateResponses();
    }
    
    submitExtra() {
        this.checkboxGroup.updateResponses();
    }

    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: PvfCommonV2022_6Controller
};
