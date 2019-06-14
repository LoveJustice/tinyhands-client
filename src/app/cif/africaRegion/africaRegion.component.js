import {BaseCifController} from '../baseCifController.js';
import {CifModalController} from '../cifModalController.js';
import {AssociatedPersonModalController} from '../associatedPersonModalController.js';
import './africaRegion.less';

import templateUrl from './africaRegion.html';
import topTemplate from './step-templates/top.html';
import mainPvTemplate from './step-templates/mainPv.html';
import pvsTemplate from './step-templates/potentialVictims/potentialVictims.html';
import recruitmentTemplate from './step-templates/recruitment.html';
import travelTemplate from './step-templates/travel.html';
import tbsTemplate from './step-templates/transportationBoxes/transportationBoxes.html';
import legalTemplate from './step-templates/legal.html';
import pbsTemplate from './step-templates/personBoxes/personBoxes.html';
import lbsTemplate from './step-templates/locationBoxes/locationBoxes.html';
import vbsTemplate from './step-templates/vehicleBoxes/vehicleBoxes.html';
import finalTemplate from './step-templates/final.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import potentialVictimModalTemplate from './step-templates/potentialVictims/potentialVictimModal.html';
import transportationBoxModalTemplate from './step-templates/transportationBoxes/transportationBoxModal.html';
import personBoxTemplate from './step-templates/personBoxes/personBoxModal.html';
import locationBoxTemplate from './step-templates/locationBoxes/locationBoxModal.html';
import vehicleBoxTemplate from './step-templates/vehicleBoxes/vehicleBoxModal.html';
import attachmentTemplate from './step-templates/attachments/attachmentModal.html';

export class CifAfricaRegionController extends BaseCifController {
    constructor($scope, $uibModal, constants, CifService, $stateParams, $state) {
        'ngInject';        
        super($scope, $uibModal, constants, CifService, $stateParams, $state);
       
        this.stepTemplates = [
            topTemplate,
            mainPvTemplate,
            pvsTemplate,
            recruitmentTemplate,
            travelTemplate,
            tbsTemplate,
            legalTemplate,
            pbsTemplate,
            lbsTemplate,
            vbsTemplate,
            finalTemplate,
            attachmentsTemplate
        ];
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport', 'Citizenship'];
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
    controller: CifAfricaRegionController
};
