import {BaseCifController} from '../baseCifController.js';
import {CifModalController} from '../cifModalController.js';
import {AssociatedPersonModalController} from '../associatedPersonModalController.js';
import './bangladesh.less';

import templateUrl from './bangladesh.html?url';
import topTemplate from './step-templates/top.html?url';
import mainPvTemplate from './step-templates/mainPv.html?url';
import pvsTemplate from '../common/step-templates/potentialVictims/potentialVictims.html?url';
import recruitmentTemplate from './step-templates/recruitment.html?url';
import travelTemplate from './step-templates/travel.html?url';
import tbsTemplate from '../common/step-templates/transportationBoxes/transportationBoxes.html?url';
import legalTemplate from './step-templates/legal.html?url';
import pbsTemplate from '../common/step-templates/personBoxes/personBoxes.html?url';
import lbsTemplate from '../common/step-templates/locationBoxes/locationBoxes.html?url';
import vbsTemplate from '../common/step-templates/vehicleBoxes/vehicleBoxes.html?url';
import finalTemplate from './step-templates/final.html?url';
import attachmentsTemplate from '../common/step-templates/attachments/attachment.html?url';
import logbookTemplate from '../common/step-templates/logbook.html?url';

import potentialVictimModalTemplate from '../common/step-templates/potentialVictims/potentialVictimModal.html?url';
import transportationBoxModalTemplate from '../common/step-templates/transportationBoxes/transportationBoxModal.html?url';
import personBoxTemplate from './step-templates/personBoxes/personBoxModal.html?url';
import locationBoxTemplate from './step-templates/locationBoxes/locationBoxModal.html?url';
import vehicleBoxTemplate from '../common/step-templates/vehicleBoxes/vehicleBoxModal.html?url';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html?url';

export class CifBangladeshController extends BaseCifController {
    constructor($scope, $uibModal, constants, CifService, $stateParams, $state, $timeout, IrfService,  SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';        
        super($scope, $uibModal, constants, CifService, $stateParams, $state, $timeout, IrfService,  SpinnerOverlayService, $uibModalStack, SessionService);
       
        this.stepTemplates = [
            {template:topTemplate, name:"Top"},
            {template:mainPvTemplate, name:"Potential Victim"},
            {template:pvsTemplate, name:"Other PVs"},
            {template:recruitmentTemplate, name:"Recruitment"},
            {template:travelTemplate, name:"Travel"},
            {template:tbsTemplate, name:"Transportation"},
            {template:legalTemplate, name:"Legal"},
            {template:pbsTemplate, name:"Person Boxes"},
            {template:lbsTemplate, name:"Location Boxes"},
            {template:vbsTemplate, name:"Vehicle Boxes"},
            {template:finalTemplate, name:"Final"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:logbookTemplate, name:"Compliance"},
        ];
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport', 'Other ID#'];
    }
    
    openPotentialVictimModal(responses = [], isAdd = false, idx=null) {
    	this.commonModal(responses, isAdd, idx, AssociatedPersonModalController, 'PotentialVictimModalController',
    			potentialVictimModalTemplate, 'OtherPotentialVictims');
    }
    
    openTransportationBoxModal(responses = [], isAdd = false, idx=null) {
    	this.commonModal(responses, isAdd, idx, CifModalController, 'TransportationBoxModalController',
    			transportationBoxModalTemplate, 'Transportations');
    }
    
    openPersonBoxModal(responses = [], isAdd = false, idx=null) {
    	this.commonModal(responses, isAdd, idx, AssociatedPersonModalController, 'PersonBoxModalController',
    			personBoxTemplate, 'PersonBoxes');
    }
    
    openLocationBoxModal(responses = [], isAdd = false, idx=null) {
    	this.commonModal(responses, isAdd, idx, CifModalController, 'LocationBoxModalController',
    			locationBoxTemplate, 'LocationBoxes');
    }
    
    openVehicleBoxModal(responses = [], isAdd = false, idx=null) {
    	this.commonModal(responses, isAdd, idx, CifModalController, 'VehicleBoxModalController',
    			vehicleBoxTemplate, 'VehicleBoxes');
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, CifModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: CifBangladeshController
};
