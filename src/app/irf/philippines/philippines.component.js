import {BaseIrfBlindVerificationController} from '../baseIrfBlindVerificationController.js';
import {BaseModalController} from '../../baseModalController.js';
const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from '../common/irf.html';
import IntercepteeModalController from '../interceptee2022_08Modal.controller';
import intercepteeModalTemplate from '../common/step-templates/interceptees/interceptee2022_8Modal.html';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class IrfPhilippinesController extends BaseIrfBlindVerificationController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, BaseUrlService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, BaseUrlService);
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.profileQuestions = [968.1,968.2,968.3,968.4,968.5,968.6,968.7,968.8,968.9,968.11];
        this.destinationQuestions = ["destinationLabel",245.0,245.1,245.2,245.3];
        this.purposeQuestions = ["purposeLabel",924.1, 924.2,924.3, 924.4,924.5,924.6,924.7];
        this.vulnerabilityQuestions = ["vulnerableLabel",30,1073,59,502,974,1083,988,928,980,186,930];
        this.deceiveQuestions = ["deceiveLabel",925,45,927,929,58,942,713,926,280,197];
        this.controlLeftQuestions = ["coachedLabel",603,23,931,"otherControlLabel",932,933,247,10,55,1085,501,1076,"minorSeparated",17,79,1086];
        this.controlRightQuestions = [234,1068,"jobLabel",934,935,936,937,938,939,57,712,"marriedLabel",24,25,26,216];
        this.details = {
            968.1:{
                enabled:true,
                group:968,
                label:'Runaway',
                value:'Runaway',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.2:{
                enabled:true,
                group:968,
                label:'Recently enslaved',
                value:'Recently enslaved',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.3:{
                enabled:true,
                group:968,
                label:'Unemployed',
                value:'Unemployed',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.4:{
                enabled:true,
                group:968,
                label:'Extremely poor',
                value:'Extremely poor',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.5:{
                enabled:true,
                group:968,
                label:'From rural area',
                value:'From rural area',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.6:{
                enabled:true,
                group:968,
                label:'Uneducated',
                value:'Uneducated',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.7:{
                enabled:true,
                group:968,
                label:'Young looking',
                value:'Young looking',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.8:{
                enabled:true,
                group:968,
                label:'Begger',
                value:'Begger',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.9:{
                enabled:true,
                group:968,
                label:'Orphan',
                value:'Orphan',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.11:{
                enabled:true,
                group:968,
                label:'Other:',
                type:'other-checkbox-group',
                format:'col-md-3',
                points:0
            },
            
            destinationLabel: {
                enabled:true,
                label:'Destination area known for trafficking',
                type:'header',
                format:'',
                points:0
            },
            245.0:{
                enabled:true,
                group:245,
                label:"PV doesn't know",
                value:"PV doesn't know",
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.1:{
                enabled:true,
                group:245,
                label:'Middle East',
                value: 'Middle East',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.2:{
                enabled:true,
                group:245,
                label:'Asia',
                value:'Asia',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.3:{
                enabled:true,
                group:245,
                label:'Other:',
                type:'other-checkbox-group',
                format:'col-md-6',
                points:0
            },
            purposeLabel: {
                enabled:true,
                label:'Purpose industry known for trafficking',
                type:'header',
                format:'',
                points:0
            },
            924.1:{
                enabled:true,
                group:924,
                label:'Domestic work',
                value:'Domestic work',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.2:{
                enabled:true,
                group:924,
                label:'Agriculture',
                value:'Agriculture',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.3:{
                enabled:true,
                group:924,
                label:'Construction',
                value:'Construction',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.4:{
                enabled:true,
                group:924,
                label:'Factory',
                value:'Factory',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.5:{
                enabled:true,
                group:924,
                label:'Restaurant',
                value:'Restaurant',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.6:{
                enabled:true,
                group:924,
                label:'Spa/massage',
                value:'Spa/massage',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.7:{
                enabled:true,
                group:924,
                label:'Other:',
                type:'other-checkbox-group',
                format:'col-md-6',
                points:0
            },
            
            vulnerableLabel:{
                enabled:true,
                label:'Signs of Vulnerability',
                type:'header',
                format:'',
                points:0
            },
            30:{
                enabled:true,
                label:'Caught in a lie',
                type:'checkbox',
                format:'col-md-6',
                points:0
            },     
            1073:{
                enabled:true,
                label:"No Phone",
                type:'checkbox',
                format:'col-md-6',
                points:0
            },
            59:{
                enabled:true,
                label:'No/small bags though claim to be going for a long time',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            502:{
                enabled:true,
                label:"Doesn't speak local language at destination",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            974:{
                enabled:true,
                label:'First time traveling abroad',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1083:{
                enabled:true,
                label:'Is or was traveling with someone they recently met',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            988:{
                enabled:true,
                label:'Flight paid for in cash or pre-paid credit card',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            928:{
                enabled:true,
                label:'Forged or falsified documents',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            980:{
                enabled:true,
                label:'Visa does not match nature of travel',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            186:{
                enabled:true,
                label:'One way ticket',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            930:{
                enabled:true,
                label:'Other',
                type:'other-checkbox',
                format:'col-md-12',
                points:0
            },
            
            
            
            78:{
                enabled:true,
                label:"Family doesn't know they are going",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            
            
            
            
            "deceiveLabel":{
                enabled:true,
                label:'Subsection B (One or more required for airport intercept)',
                type:'header',
                format:'',
                points:0
            },
            
            925:{
                enabled:true,
                label:'Insufficient resources to live/get home',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            45:{
                enabled:true,
                label:'Study - no documentation/knowledge/details',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            927:{
                enabled:true,
                label:'Medical Treatment - no documentation/knowledge/details',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            929:{
                enabled:true,
                label:'Called place and confirmed deception',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            58:{
                enabled:true,
                label:'Could not confirm job',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            942:{
                enabled:true,
                label:'Family unwilling to let them go',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            713:{
                enabled:true,
                label:'Job details changed en route',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            926:{
                enabled:true,
                label:'Minor unaccompanied by guardian',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            280:{
                enabled:true,
                label:'Not speaking on their own behalf',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            197:{
                enabled:true,
                label:'Afraid of suspect/host',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            
            
            "coachedLabel":{
                enabled:true,
                label:'Signs of Coached Deception/Evasion',
                type:'header',
                format:'',
                points:0
            },
            603:{
                enabled:true,
                label:'Contradiction between stories of suspect and PV',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            23:{
                enabled:true,
                label:'Travelling with someone not with them now',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            931:{
                enabled:true,
                label:'Led to other country without their knowledge',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            "otherControlLabel":{
                enabled:true,
                label:'Other Illegitimate Means of Control by Suspect',
                type:'header',
                format:'',
                points:0
            },
            932:{
                enabled:true,
                label:'Travelling because of a threat',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            933:{
                enabled:true,
                label:'Owes debt to person who recruited/paid travel',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            247:{
                enabled:true,
                label:'Someone (not a relative) paid travel expenses',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            10:{
                enabled:true,
                label:'Drugged or drowsy',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            55:{
                enabled:true,
                label:'Passport is with a suspect',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            1085:{
                enabled:true,
                label:'ID or work permit is with a suspect',
                type:'checkbox',
                format:'col-md-12',
                points:6
            },
            501:{
                enabled:true,
                label:'Mobile phone taken away',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            1076:{
                enabled:true,
                label:'Forcibly abducted',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            "minorSeparated":{
                enabled:true,
                label:'Minor Illegitimately Separated from Family',
                type:'header',
                format:'',
                points:0
            },
            17:{
                enabled:true,
                label:'Wife/fiancee under 18',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            79:{
                enabled:true,
                label:'Under 18, Enticed without consent of family',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            1086:{
                enabled:true,
                label:'Under 16, recruited for work',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            
            234:{
                enabled:true,
                label:'Known Trafficker',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            1068:{
                enabled:true,
                label:'Connected to known Trafficker',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            "jobLabel":{
                enabled:true,
                label:'Signs of Job too Good to Be True',
                type:'header',
                format:'',
                points:0
            },
            934:{
                enabled:true,
                label:'Job:',
                type:'text',
                format:'col-md-12',
                points:0
            },
            935:{
                enabled:true,
                label:'Promised pay:',
                type:'text',
                format:'col-md-12',
                points:0
            },
            936:{
                enabled:true,
                label:'Normal pay',
                type:'text',
                format:'col-md-12',
                points:0
            },
            937:{
                enabled:true,
                label:'Promised pay more than double normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            938:{
                enabled:true,
                label:'Promised pay a little higher than normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:2
            },
            939:{
                enabled:true,
                label:'No address/phone number',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            57:{
                enabled:true,
                label:'Confirmed it is not a real job',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            712:{
                enabled:true,
                label:'Lacks relevant experience',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            "marriedLabel":{
                enabled:true,
                label:'Signs of False or Forced Marriage',
                type:'header',
                format:'',
                points:0
            },
            24:{
                enabled:true,
                label:'Married in the past 2 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:8
            },
            25:{
                enabled:true,
                label:'Married within the past 2-8 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            26:{
                enabled:true,
                label:'Met in the past 2 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:6
            },
            216:{
                enabled:true,
                label:'On their way to get married',
                type:'checkbox',
                format:'col-md-12',
                points:3
            },
        };
        
        this.contactList = [['Police','Shopkeeper','Taxi driver'],['Other NGO','Hotel Owner','Subcommittee']];
        
        for (let entry in this.details) {
            let detail = this.details[entry];
            if (detail.type === 'checkbox-group') {
                this.checkboxGroup.checkboxItem(detail.group, detail.value);
            }
        }
        
        this.version2022_8 = true;
    }
    
    resourcesBorderClass() {
    	return 'resourcesBoldBorder';
    }
    
    overrideRadioItems(items, questionId) {
        let result = items;
        if (questionId === 92) {
            result = this.contactList;
        }
        return result;
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport', 'Other ID#'];
    }
    
    getIrfComplete() {
        this.checkboxGroup.initOriginalValues(this.questions);
        this.initializeVerification();
    }
    
    submitExtra() {
        this.setFindings();
        this.checkboxGroup.updateResponses();
    }
    
    saveExtra() {
        this.checkboxGroup.updateResponses();
    }

    openIntercepteeModal(card, isAdd = false, idx = null) {
        this.commonModal(card, isAdd, idx, IntercepteeModalController,'IntercepteeModalController',
                intercepteeModalTemplate, 'People', {identificationTypes:this.getDefaultIdentificationTypes()});
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: IrfPhilippinesController,
};

