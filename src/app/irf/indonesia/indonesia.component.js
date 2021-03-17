import {BaseIrfCommonController} from '../baseIrfCommonController.js';
import {BaseModalController} from '../../baseModalController.js';
const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from '../common/irf.html';

import IntercepteeModalController from '../intercepteeModal.controller';
import intercepteeModalTemplate from '../common/step-templates/interceptees/intercepteeConsentModal.html';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class IrfIndonesiaController extends BaseIrfCommonController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.profileQuestions = [968.1,968.2,968.3,968.4,968.5,968.6,968.7,968.8];
        this.destinationQuestions = ["destinationLabel",245.1, 245.2, 245.3, 245.4];
        this.purposeQuestions = ["purposeLabel",924.1,924.2,924.3,924.4,924.5,924.6,924.7,924.8];
        this.vulnerabilityQuestions = ["vulnerableLabel",246,502,925,78,942,926,280,"metLabel",243,244];
        this.deceiveQuestions = ["deceiveLabel",59,117,45,927,996,929,58,30,928,930];
        this.controlLeftQuestions = ["coachedLabel",603,23,931,"otherControlLabel",932,933,247,10,55,501,"minorSeparated",17,79];
        this.controlRightQuestions = [234,"jobLabel",934,935,936,937,938,939,57,712,"marriedLabel",24,25,26,216];
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
                label:'Escaping an exploitative situation',
                value:'Escaping an exploitative situation',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.3:{
                enabled:true,
                group:968,
                label:'Young looking woman',
                value:'Young looking woman',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.4:{
                enabled:true,
                group:968,
                label:'Revealing clothing',
                value:'Revealing clothing',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.5:{
                enabled:true,
                group:968,
                label:'Young man',
                value:'Young man',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.6:{
                enabled:true,
                group:968,
                label:'Child(ren)',
                value:'Child(ren)',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.7:{
                enabled:true,
                group:968,
                label:'Migrant',
                value:'Migrant',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            968.8:{
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
            245.1:{
                enabled:true,
                group:245,
                label:'Papua',
                value: 'Papua',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.2:{
                enabled:true,
                group:245,
                label:'Malaysia',
                value: 'malaysia',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.3:{
                enabled:true,
                group:245,
                label:'Saudi Arabia',
                value: 'Saudi Arabia',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.4:{
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
                label:'Cafe',
                value:'Cafe',
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
                label:'Seafood processing',
                value:'Seafood processing',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.5:{
                enabled:true,
                group:924,
                label:'Fishing',
                value:'Fishing',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.6:{
                enabled:true,
                group:924,
                label:'Mining',
                value:'Mining',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.7:{
                enabled:true,
                group:924,
                label:'Plantation',
                value:'Plantation',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.8:{
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
            246:{
                enabled:true,
                label:"Doesn't know destination",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            502:{
                enabled:true,
                label:"Doesn't speak language at destination",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            925:{
                enabled:true,
                label:'Insufficient resources to live/get home',
                type:'checkbox',
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
            942:{
                enabled:true,
                label:'Family unwilling to let them go',
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
            metLabel:{
                enabled:true,
                label:'Is or was traveling with someone they recently met through:',
                type:'header',
                format:'col-md-12',
                points:0
            },
            242:{
                enabled:true,
                label:'Missed call',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            243:{
                enabled:true,
                label:'Facebook',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            244:{
                enabled:true,
                label:'Other website:',
                type:'other-checkbox',
                format:'col-md-6',
                points:0
            },
            
            "deceiveLabel":{
                enabled:true,
                label:'Signs of Attempts to Evade or Deceive',
                type:'header',
                format:'',
                points:0
            },
            59:{
                enabled:true,
                label:'No bags through claim to be going for a long time',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            117:{
                enabled:true,
                label:'Full bags but claim to be going for a short time',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            45:{
                enabled:true,
                label:'Study - no documentation/knowledge',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            927:{
                enabled:true,
                label:'Treatment - no documentation/knowledge',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            996:{
                enabled:true,
                label:'Fake documentation',
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
            30:{
                enabled:true,
                label:'Caught in a lie',
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
            
            "coachedLabel":{
                enabled:true,
                label:'Signs of Coached Deception/Evasion',
                type:'header',
                format:'',
                points:0
            },
            603:{
                enabled:true,
                label:'Contradiction in stories of suspect/victim',
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
                label:'Other Illegitimate Means of Control',
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
                label:'Passport is with broker',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            501:{
                enabled:true,
                label:'Mobile phone taken away',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            "minorSeparated":{
                enabled:true,
                label:'Minor Separated Without Consent',
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
            
            234:{
                enabled:true,
                label:'Known Trafficker',
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
        
        this.contactList = [['Police','Shopkeeper','Taxi driver'],['Other NGO','Hotel Owner','Subcommittee'],['Boat worker','Bus driver']];
        
        for (let entry in this.details) {
            let detail = this.details[entry];
            if (detail.type === 'checkbox-group') {
                this.checkboxGroup.checkboxItem(detail.group, detail.value);
            }
        }
    }
    
    getDefaultIdentificationTypes() {
        return ['Passport', 'ID#'];
    }
    
    getIrfComplete() {
        this.checkboxGroup.initOriginalValues(this.questions);
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
    controller: IrfIndonesiaController,
};
