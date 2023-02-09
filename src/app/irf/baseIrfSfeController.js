import {BaseIrfBlindVerificationController} from './baseIrfBlindVerificationController.js';
const OtherData = require('../otherData.js');
const DateData = require('../dateData.js');
import './common/irf.less';

import topBoxTemplate from './common/step-templates/topBoxSfe.html';
import areaTemplate from './common/step-templates/areaSfe.html';
import industryTemplate from './common/step-templates/industrySfe.html';
import resourcesTemplate from './common/step-templates/resourcesSfe.html';
import controlTemplate from './common/step-templates/controlSfe.html';
import narrativeTemplate from './common/step-templates/narrativeSfe.html';
import peopleTemplate from './common/step-templates/peopleSfe.html';
import resultTemplate from './common/step-templates/resultSfe.html';
import attachmentsTemplate from './common/step-templates/attachments/attachment.html';
import complianceTemplate from './common/step-templates/compliance.html';
import verificationTemplate from './common/step-templates/verificationBlind.html';

export class BaseIrfSfeController extends BaseIrfBlindVerificationController {
	constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
        
        this.stepTemplates = [
            {template:topBoxTemplate, name:"Top"},
            {template:areaTemplate, name:"Area"},
            {template:industryTemplate, name:"Industry"},
            {template:resourcesTemplate, name:"Resources"},
            {template:controlTemplate, name:"Control"},
            {template:narrativeTemplate, name:"Narrative"},
            {template:peopleTemplate, name:"People"},
            {template:resultTemplate, name:"Result"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:complianceTemplate, name:"Compliance"},
            {template:verificationTemplate, name:"Verification"},
        ];
        
        this.pvPerson = null;
        this.agentName = "";
        this.agentPhone = "";
	}
	
	setIntercepteeCard(card, role, notPresent, name, phone) {
		for (let respIdx in card.responses) {
			if (card.responses[respIdx].question_id === 9) {
				card.responses[respIdx].response.role.value = role;
				card.responses[respIdx].response.name.value = name;
				card.responses[respIdx].response.phone.value = phone;
			} else if (card.responses[respIdx].question_id === 1331) {
				card.responses[respIdx].response.value = notPresent;
			}
		}
	}
	
	initializeSfeController() {
		this.initializeVerification();
		
		this.agentName = "";
		this.agentPhone = "";
		this.pvPerson = null;

		let intercepteeCards = this.getCardInstances('People');
		if (intercepteeCards.length === 0) {
			let card = this.createCard('People');
			this.setIntercepteeCard(card, 'PVOT','true','','');
			intercepteeCards.push(card);
		}
		for (let idx in intercepteeCards) {
			for (let respIdx in intercepteeCards[idx].responses) {
				if (intercepteeCards[idx].responses[respIdx].question_id === 9) {
					if (intercepteeCards[idx].responses[respIdx].response.role.value === 'PVOT') {
						this.pvPerson = {
							questions: _.keyBy(intercepteeCards[idx].responses, (x) => x.question_id),
						};
						this.pvPerson.dateData = new DateData(this.pvPerson.questions);
						this.pvPerson.dateData.setDate(9, 'person');
						this.pvPerson.otherData = new OtherData(this.pvPerson.questions);
						this.pvPerson.otherData.setRadioButton(['Parent','Sibling','Grandparent','Aunt/Uncle','Spouse'],'9-guardian_relationship');
					}
					if (intercepteeCards[idx].responses[respIdx].response.role.value === 'Suspect') {
						this.agentName = intercepteeCards[idx].responses[respIdx].response.name.value;
						this.agentPhone = intercepteeCards[idx].responses[respIdx].response.phone.value;
					}
				}
			}
		}
	}
	
	saveSfe() {
		this.pvPerson.otherData.updateResponses();
        this.pvPerson.dateData.updateResponses();
        // Make sure agentName and agentPhone are not null or undefined
        if (!this.agentName) {
        	this.agentName = '';
        }
        if (!this.agentPhone) {
        	this.agentPhone = '';
        }
		let foundSuspect = false;
		let intercepteeCards = this.getCardInstances('People');
		for (let idx in intercepteeCards) {
			for (let respIdx in intercepteeCards[idx].responses) {
				if (intercepteeCards[idx].responses[respIdx].question_id === 9) {
					if (intercepteeCards[idx].responses[respIdx].response.role.value !== 'PVOT') {
						foundSuspect = true;
						if (this.agentName || this.agentPhone) {
							intercepteeCards[idx].responses[respIdx].response.name.value = this.agentName;
							intercepteeCards[idx].responses[respIdx].response.phone.value = this.agentPhone;
							if (this.questions[2081].response.value === 'Yes') {
								intercepteeCards[idx].responses[respIdx].response.role.value = 'Suspect';
							} else {
								intercepteeCards[idx].responses[respIdx].response.role.value = 'Agent';
							}
						} else {
							// agent name and phone are null/blank do not keep suspect card
							intercepteeCards.splice(idx, 1);
						}
						break;
					}
				}
			}
		}
		if (!foundSuspect && (this.agentName || this.agentPhone)) {
			// There is no pre-existing suspect card and the agent name or phone is populated
			let card = this.createCard('People');
			if (this.questions[2081].response.value === 'Yes') {
				this.setIntercepteeCard(card, 'Suspect','true', this.agentName, this.agentPhone);
			} else {
				this.setIntercepteeCard(card, 'Agent','true', this.agentName, this.agentPhone);
			}
			intercepteeCards.push(card);
		}
	}
}