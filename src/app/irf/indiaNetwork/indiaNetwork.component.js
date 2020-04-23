import {BaseIrfController} from '../baseIrfController.js';
import {BaseModalController} from '../../baseModalController.js';
import '../common/irf.less';

const CheckboxGroup = require('../../checkboxGroup.js');

import templateUrl from '../common/irf.html';
import topBoxTemplate from '../common/step-templates/topBox.html';
import profileTemplate from '../common/step-templates/profile.html';
import areaIndustryTemplate from '../common/step-templates/areaIndustry.html';
import resourceSafetyTemplate from '../common/step-templates/resourceSafety.html';
import controlTemplate from '../common/step-templates/control.html';
import familyTemplate from '../common/step-templates/family.html';
import noticedTemplate from '../common/step-templates/noticed.html';
import intercepteesTemplate from '../common/step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from '../common/step-templates/finalProcedures.html';
import attachmentsTemplate from '../common/step-templates/attachments/attachment.html';
import logbookTemplate from '../common/step-templates/logbook.html';

import IntercepteeModalController from '../intercepteeModal.controller';
import intercepteeModalTemplate from '../common/step-templates/interceptees/intercepteePassportModal.html';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class IrfIndiaNetworkController extends BaseIrfController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack);
        
        this.stepTemplates = [
            {template:topBoxTemplate, name:"Top"},
            {template:profileTemplate, name:"Profile"},
            {template:areaIndustryTemplate, name:"Area/Industry"},
            {template:resourceSafetyTemplate, name:"Resources/Safety"},
            {template:controlTemplate, name:"Illegitimate Control"},
            {template:familyTemplate, name:"Family"},
            {template:noticedTemplate, name:"Noticed"},
            {template:intercepteesTemplate, name:"Interceptees"},
            {template:finalProceduresTemplate, name:"Final Procedures"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:logbookTemplate, name:"Logbook"},
        ];
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.profileQuestions = [41,123,642,166, 915, 916, 917];
        this.destinationQuestions = ["destinationLabel",245.1, 245.2, 245.3, 245.4];
        this.purposeQuestions = ["purposeLabel",924.1, 924.2,924.3, 924.4, 924.5, 924.6];
        this.vulnerabilityQuestions = ["vulnerableLabel",246,502,925,78,942,926,280,"metLabel",243,242,244];
        this.deceiveQuestions = ["deceiveLabel",59,117,45,927,928,929,58,30,930];
        this.controlLeftQuestions = ["coachedLabel",603,23,931,"otherControlLabel",932,933,247,10,55,501,"minorSeparated",17,79];
        this.controlRightQuestions = ["jobLabel",934,935,936,937,938,939,57,712,"marriedLable",24,25,26,216];
        this.details = {
            41:{
                enabled:true,
                label:'1.1 Runaway',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            123:{
                enabled:true,
                label:'1.2 Young looking',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            642:{
                enabled:true,
                label:'1.3 Nepali girl',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            166:{
                enabled:true,
                label:'1.4 Wearing revealing clothing',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            915:{
                enabled:true,
                label:'1.5 Child(ren)',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            916:{
                enabled:true,
                label:'1.6 Migrant',
                type:'checkbox',
                format:'col-md-3',
                points:0
            },
            917:{
                enabled:true,
                label:'1.7 Other:',
                type:'other-checkbox',
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
                label:'2.1 Delhi',
                value: 'Delhi',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.2:{
                enabled:true,
                group:245,
                label:'2.2 GB Road',
                value: 'GB Road',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.3:{
                enabled:true,
                group:245,
                label:'2.3 Gulf Country',
                value: 'Gulf Country',
                type:'checkbox-group',
                format:'col-md-3',
                points:0
            },
            245.4:{
                enabled:true,
                group:245,
                label:'2.4 Other:',
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
                label:'2.5 Domestic work',
                value:'Domestic work',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.2:{
                enabled:true,
                group:924,
                label:'2.6 Brick Kiln',
                value:'Brick Kiln',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.3:{
                enabled:true,
                group:924,
                label:'2.7 Dance Bar',
                value:'Dance Bar',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.4:{
                enabled:true,
                group:924,
                label:'2.8 Child Labour',
                value:'Child Labour',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.5:{
                enabled:true,
                group:924,
                label:'2.9 Bonded Labour',
                value:'Bonded Labour',
                type:'checkbox-group',
                format:'col-md-4',
                points:0
            },
            924.6:{
                enabled:true,
                group:924,
                label:'2.10 Other:',
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
                label:"3.1 Doesn't know destination",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            502:{
                enabled:true,
                label:"3.2 Doesn't speak language at destination",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            925:{
                enabled:true,
                label:'3.3 Insufficient resources to live/get home',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            78:{
                enabled:true,
                label:"3.4 Family doesn't know they are going",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            942:{
                enabled:true,
                label:'3.5 Family unwilling to let them go',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            926:{
                enabled:true,
                label:'3.6 Minor unaccompanied by guardian',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            280:{
                enabled:true,
                label:'3.7 Not speaking on their own behalf',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            metLabel:{
                enabled:true,
                label:'3.8 Is or was traveling with someone they recently met through:',
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
                label:'3.9 No bags through claim to be going for a long time',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            117:{
                enabled:true,
                label:'3.10 Full bags but claim to be going for a short time',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            45:{
                enabled:true,
                label:'3.11 Study - no documentation/knowledge',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            927:{
                enabled:true,
                label:'3.12 Treatment - no documentation/knowledge',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            928:{
                enabled:true,
                label:'3.13 Forged or falsified documents',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            929:{
                enabled:true,
                label:'3.14 Called place and confirmed deception',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            58:{
                enabled:true,
                label:'3.15 Could not confirm job',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            30:{
                enabled:true,
                label:'3.16 Caught in a lie',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            930:{
                enabled:true,
                label:'3.17 Other',
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
                label:'4.1 Contradiction in stories of suspect/victim',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            23:{
                enabled:true,
                label:'4.2 Travelling with someone not with them now',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            931:{
                enabled:true,
                label:'4.3 Led to other country without their knowledge',
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
                label:'4.4 Travelling because of a threat',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            933:{
                enabled:true,
                label:'4.5 Owes debt to person who recruited/paid travel',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            247:{
                enabled:true,
                label:'4.6 Someone (not a relative) paid travel expenses',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            10:{
                enabled:true,
                label:'4.7 Drugged or drowsy',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            55:{
                enabled:true,
                label:'4.8 Passport is with broker',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            501:{
                enabled:true,
                label:'4.9 Mobile phone taken away',
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
                label:'4.10 Wife/fiancee under 18',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            79:{
                enabled:true,
                label:'4.11 Under 18, Enticed without consent of family',
                type:'checkbox',
                format:'col-md-12',
                points:10
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
                label:'4.12 Promised pay more than double normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            938:{
                enabled:true,
                label:'4.13 Promised pay a little higher than normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:2
            },
            939:{
                enabled:true,
                label:'4.14 No address/phone number',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            57:{
                enabled:true,
                label:'4.15 Confirmed it is not a real job',
                type:'checkbox',
                format:'col-md-12',
                points:9
            },
            712:{
                enabled:true,
                label:'4.16 Lacks relevant experience',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            "marriedLable":{
                enabled:true,
                label:'Signs of False or Forced Marriage',
                type:'header',
                format:'',
                points:0
            },
            24:{
                enabled:true,
                label:'4.17 Married in the past 2 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:8
            },
            25:{
                enabled:true,
                label:'4.18 Married within the past 2-8 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:4
            },
            26:{
                enabled:true,
                label:'4.19 Met in the past 2 weeks',
                type:'checkbox',
                format:'col-md-12',
                points:6
            },
            216:{
                enabled:true,
                label:'4.20 On their way to get married',
                type:'checkbox',
                format:'col-md-12',
                points:3
            },
        };
        
        this.contactList = [['Police','Shopkeeper','Taxi driver'],['Other NGO','Hotel Owner','Subcommittee'],['Rickshaw driver','Bus driver']];
        
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
    			intercepteeModalTemplate, 'Interceptees', {identificationTypes:this.getDefaultIdentificationTypes()});
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: IrfIndiaNetworkController,
};
