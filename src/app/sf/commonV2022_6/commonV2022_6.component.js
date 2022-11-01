import {BaseSfController} from '../baseSfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './commonV2022_6.less';
const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from './commonV2022_6.html';

import topTemplate from './step-templates/top.html';
import suspectInformationTemplate from './step-templates/suspectInformation.html';
import associationsNarrativeTemplate from './step-templates/associationsNarrative.html';
import legalTemplate from './step-templates/legal.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import attachmentTemplate from './step-templates/attachments/attachment-modal.html';

export class SfCommonV2022_6Controller extends BaseSfController {
    constructor($scope, $uibModal, SfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService, $timeout) {
        'ngInject';        
        super($scope, $uibModal, SfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService, $timeout);

        this.stepTemplates = [
            {template:topTemplate,name:'Top Box'},
            {template:suspectInformationTemplate,name:'Suspect Information'},
            {template:associationsNarrativeTemplate, name:'Associations'},
            {template:legalTemplate,name:'Legal'},
            {template:attachmentsTemplate,name:'Attachments'},
        ];
        
        this.checkboxGroupInfo = new CheckboxGroup();
        //'Recruiter','Transporter','Master','Facilitator','Boss Trafficker', 'Host'
        this.role = [
        	{
                value:"Recruiter",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Transporter",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Master",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Facilitator",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Boss Trafficker",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            {
                value:"Host",
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
        ];
        for (let idx in this.role) {
        	if (this.role[idx].type === 'checkbox-group') {
        		this.checkboxGroupInfo.checkboxItem('sfTopMergedPerson-role', this.role[idx].value);
        	}
        }
        
        this.legalDateData = ['sfLegalArrestDate', 'sfLegalChargeSheetDate', 'sfLegalLocationLastDate'];
        this.legalCheckboxGroupQuestions = {
        	sfLegalPvUnable:[
		        	{
		                value:"No:",
		                type:'checkbox-group'
		            },
		            {
		                value:"PV afraid for reputation",
		                type:'checkbox-group'
		            },
		            {
		                value:"PV afraid for their safety",
		                type:'checkbox-group'
		            },
		            {
		                value:"PVs don't believe they were being trafficked",
		                type:'checkbox-group'
		            },
		            {
		                value:"PV family not willing",
		                type:'checkbox-group'
		            },
		            {
		                value:"Couldn't reestablish contact with PV",
		                type:'checkbox-group'
		            },
		        ],
		    sfLegalLocationUnable:[
		        	{
		                value:"Insufficient Suspect Bio Details",
		                type:'checkbox-group'
		            },
		            {
		                value:"Current Location Unknown",
		                type:'checkbox-group'
		            },
		            {
		                value:'Last Known Location',
		                type:'checkbox-group'
		            },
		        ],
		    sfLegalPoliceUnable:[
		        	{
		                value:"No",
		                type:'checkbox-group',
		            },
		            {
		                value:"Police say not enough evidence",
		                type:'checkbox-group',
		            },
		            {
		                value:'Other Reason:',
		                type:'other-checkbox-group',
		            },
		        ]
		}
    }
    
    getInfoCardConfig() {
    	let infoCard = {
        	dateQuestions: [{tag:'sfInformationPerson', type:'person'},{tag:'sfInformationInterviewDate', type:'basic'}],
        	otherQuestions: [],
        	checkboxGroupQuestions: [
				{tag:'sfInformationPerson-role', items:['Recruiter','Transporter','Master','Facilitator','Boss Trafficker', 'Host']}]
        };
        return infoCard;
    }
    
    getSfComplete() {
    }
    
    resetCheckboxGroupInfo() {
    	this.checkboxGroupInfo.initOriginalValues(this.questions);
    }
    
    saveExtra() {
    }
    
    submitExtra() {
    }

    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: SfCommonV2022_6Controller
};
