import {BaseIrfSfeController} from '../baseIrfSfeController.js';
import {BaseModalController} from '../../baseModalController.js';
import CheckboxGroup from '../../checkboxGroup';

import templateUrl from '../common/irf.html?url';
import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html?url';

export class IrfSfeNepalController extends BaseIrfSfeController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
        
        this.checkboxGroup = new CheckboxGroup();
        
        this.destinationQuestions = ["destinationLabel",245.1,245.2,245.3,245.4,245.5,245.6,245.7,245.8,245.9,245.11];
        this.purposeQuestions = ["purposeLabel",924.1,924.2,924.3,924.4,924.5,924.6,924.7,924.8,924.9,924.11,924.12];
        this.vulnerabilityQuestions = ["vulnerableLabel","travelPlansLabel",1807,974,1808,78,942,1809,1810,1811,"mpaLabel",1812,1813];
        this.vulnerability2Questions = ["laborLabel",1814,1815,1816,1817,1818,"prepareLabel",1819,"didNotCompleteLabel",1820.1,1820.2,1820.3,1820.4,1820.5,1821];
        this.coachedQuestions = ["coachedLabel",1822,1823,1824,1825,1829];
        this.jobTooGoodQuestions = ["jobLabel",934,935,936,712,937,938,1826,57];
        this.otherSignsQuestions = ["otherControlLabel",1082,1827,1828,55];
        
        this.controlLeftQuestions = ["coachedLabel",603,23,931,"otherControlLabel",932,933,247,10,55,501,"minorSeparated",17,79];
        this.controlRightQuestions = [234,"jobLabel",934,935,936,937,938,939,57,712,"marriedLabel",24,25,26,216];
        this.details = {
            destinationLabel: {
                enabled:true,
                label:'Destination Area known for trafficking/exploitation of labor migrants',
                type:'header',
                format:'level2Header',
                points:0
            },
            245.1:{
                enabled:true,
                group:245,
                label:'UAE',
                value: 'UAE',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.2:{
                enabled:true,
                group:245,
                label:'Qatar',
                value: 'Qatar',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.3:{
                enabled:true,
                group:245,
                label:'Malaysia',
                value: 'Malaysia',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.4:{
                enabled:true,
                group:245,
                label:'Kuwait',
                value: 'Kuwait',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.5:{
                enabled:true,
                group:245,
                label:'Saudi Arabia',
                value: 'Saudi Arabia',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.6:{
                enabled:true,
                group:245,
                label:'Jordan',
                value: 'Jordan',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.7:{
                enabled:true,
                group:245,
                label:'Poland',
                value: 'Poland',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.8:{
                enabled:true,
                group:245,
                label:'South Korea',
                value: 'South Korea',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.9:{
                enabled:true,
                group:245,
                label:'Turkey',
                value: 'Turkey',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            245.11:{
                enabled:true,
                group:245,
                label:'Other:',
                type:'other-checkbox-group',
                format:'col-md-4',
                points:0
            },
            purposeLabel: {
                enabled:true,
                label:'Purpose Industry known for trafficking/exploitation of labor migrants',
                type:'header',
                format:'level2Header',
                points:0
            },
            924.1:{
                enabled:true,
                group:924,
                label:'Domestic work',
                value:'Domestic work',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.2:{
                enabled:true,
                group:924,
                label:'Manufacturing',
                value:'Manufacturing',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.3:{
                enabled:true,
                group:924,
                label:'Construction',
                value:'Construction',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.4:{
                enabled:true,
                group:924,
                label:'Agriculture',
                value:'Agriculture',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.5:{
                enabled:true,
                group:924,
                label:'Hospitality',
                value:'Hospitality',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.6:{
                enabled:true,
                group:924,
                label:'Cleaner',
                value:'Cleaner',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.7:{
                enabled:true,
                group:924,
                label:'Supermarket',
                value:'Supermarket',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.8:{
                enabled:true,
                group:924,
                label:'Security',
                value:'Security',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.9:{
                enabled:true,
                group:924,
                label:'Food delivery',
                value:'Food delivery',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.11:{
                enabled:true,
                group:924,
                label:'Beauty Parlor',
                value:'Beauty Parlor',
                type:'checkbox-group',
                format:'col-md-2',
                points:0
            },
            924.12:{
                enabled:true,
                group:924,
                label:'Other:',
                type:'other-checkbox-group',
                format:'col-md-4',
                points:0
            },
            
            vulnerableLabel:{
                enabled:true,
                label:'Signs of Vulnerability',
                type:'header',
                format:'level2Header',
                points:0
            },
            travelPlansLabel:{
                enabled:true,
                label:'Travel Plans',
                type:'header',
                format:'level3Header',
                points:0
            },
            1807:{
                enabled:true,
                label:'Applied for job, but doesn’t know destination',
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
            1808:{
                enabled:true,
                label:"Doesn't speak Nepali",
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
            1809:{
                enabled:true,
                label:'Going to a third country via India',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1810:{
                enabled:true,
                label:'Cost of living in destination much higher than wages',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1811:{
                enabled:true,
                label:"Doesn't know what job they are applying for",
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            mpaLabel:{
                enabled:true,
                label:'Manpower Agency (MPA)',
                type:'header',
                format:'level3Header margin-top-15',
                points:0
            },
            1812:{
                enabled:true,
                label:'Using an agent',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1813:{
                enabled:true,
                label:'MPA taking excessive time to process/send migrant',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            
            
            laborLabel:{
                enabled:true,
                label:'Labor Agreement and Payment',
                type:'header',
                format:'level3Header margin-top-15',
                points:0
            },
            1814:{
                enabled:true,
                label:'Contract not in a language understood by the PV',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1815:{
                enabled:true,
                label:'Company/MPA not bearing cost to Gulf/Malaysia',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1816:{
                enabled:true,
                label:'Paid money to agent',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1817:{
                enabled:true,
                label:'Paid more than government standard cost',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            1818:{
                enabled:true,
                label:'No bhaar pai (receipt) for full amount of payment',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            prepareLabel:{
                enabled:true,
                label:'Preparation',
                type:'header',
                format:'level3Header margin-top-15',
                points:0
            },
            1819:{
                enabled:true,
                label:'Unaware of official employment migration process',
                type:'checkbox',
                format:'col-md-12',
                points:0
            },
            didNotCompleteLabel:{
                enabled:true,
                group:1820,
                label:'Did not complete at least one of the following:',
                value:'Did not complete at least one of the following:',
                type:'header',
                format:'col-md-12',
                points:0
            },
            1820.1:{
                enabled:true,
                group:1820,
                label:'Interview',
                value:'Interview',
                type:'checkbox-group',
                format:'col-md-12 margin-left-20',
                points:0
            },
             1820.2:{
                enabled:true,
                group:1820,
                label:'Health examination',
                value:'Health examination',
                type:'checkbox-group',
                format:'col-md-12 margin-left-20',
                points:0
            },
             1820.3:{
                enabled:true,
                group:1820,
                label:'Orientation',
                value:'Orientation',
                type:'checkbox-group',
                format:'col-md-12 margin-left-20',
                points:0
            },
             1820.4:{
                enabled:true,
                group:1820,
                label:'Insurance payment for length of visa',
                value:'Insurance payment for length of visa',
                type:'checkbox-group',
                format:'col-md-12 margin-left-20',
                points:0
            },
             1820.5:{
                enabled:true,
                group:1820,
                label:'Welfare fund payment',
                value:'Welfare fund payment',
                type:'checkbox-group',
                format:'col-md-12 margin-left-20',
                points:0
            },
            1821:{
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
                format:'level2Header',
                points:0
            },
            1822:{
                enabled:true,
                label:'Convinced by agent/MPA to work on visa other than work visa',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            1823:{
                enabled:true,
                label:'Process being fully facilitated by someone to travel to third country via India for work',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            1824:{
                enabled:true,
                label:'Woman being enticed by agent/MPA to go for domestic work in Gulf/Malaysia',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            1825:{
                enabled:true,
                label:'Being enticed by agent/MPA to go to banned country for migrant worker',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            1829:{
                enabled:true,
                label:'Being enticed by MPA to go to South Korea or Israel for non-seasonal work',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            
            "jobLabel":{
                enabled:true,
                label:'Signs of Job too Good to Be True',
                type:'header',
                format:'level2Header',
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
            712:{
                enabled:true,
                label:'Lacking required skills/experience/education for job',
                type:'checkbox',
                format:'col-md-12',
                points:3
            },
            937:{
                enabled:true,
                label:'Promised pay more than double normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:5
            },
            938:{
                enabled:true,
                label:'Promised pay a little higher than normal pay',
                type:'checkbox',
                format:'col-md-12',
                points:1
            },
            1826:{
                enabled:true,
                label:'Job agreement and pre-permission details do not match',
                type:'checkbox',
                format:'col-md-12',
                points:7
            },
            57:{
                enabled:true,
                label:'Confirmed it is not a real job',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            
            "otherControlLabel":{
                enabled:true,
                label:'Other Signs of Illegitimate Control by Suspect',
                type:'header',
                format:'level2Header',
                points:0
            },
            1082:{
                enabled:true,
                label:'Under 18 (enticed to work)',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            1827:{
                enabled:true,
                label:'Using an unregistered MPA',
                type:'checkbox',
                format:'col-md-12',
                points:10
            },
            1828:{
                enabled:true,
                label:'No/invalid Lt number and/or demand letter',
                type:'checkbox',
                format:'col-md-12',
                points:8
            },
            55:{
                enabled:true,
                label:'Passport withheld by agent/MPA',
                type:'checkbox',
                format:'col-md-12',
                points:2
            },
            1840.1:{
                enabled:true,
                group:1840,
                label:'Changed MPA',
                value:'Changed MPA',
                type:'checkbox-group',
                format:'',
                points:0
            },
            1840.2:{
                enabled:true,
                group:1840,
                label:'Changed destination country',
                value:'Changed destination country',
                type:'checkbox-group',
                format:'',
                points:0
            },
            1840.2:{
                enabled:true,
                group:1840,
                label:'Changed company/job',
                value:'Changed company/job',
                type:'checkbox-group',
                format:'',
                points:0
            },
        };
        
        this.contactList = [['Police','Shopkeeper','Taxi driver'],['Other NGO','Hotel Owner','Subcommittee'],['Rickshaw driver','Bus Driver']];
        
        for (let entry in this.details) {
            let detail = this.details[entry];
            if (detail.type === 'checkbox-group') {
                this.checkboxGroup.checkboxItem(detail.group, detail.value);
            }
        }
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
        this.initializeSfeController();
    }
    
    submitExtra() {
        this.setFindings();
        this.checkboxGroup.updateResponses();
        this.saveSfe();
    }
    
    saveExtra() {
        this.checkboxGroup.updateResponses();
        this.saveSfe();
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: IrfSfeNepalController,
};

