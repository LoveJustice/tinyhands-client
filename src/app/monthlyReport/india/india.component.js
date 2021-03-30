import {BaseMonthlyReportController} from '../baseMonthlyReportController.js';
import {BaseModalController} from '../../baseModalController.js';
import '../common/monthlyReport.less';

import templateUrl from '../common/monthlyReport.html';

import governanceTemplate from '../common/step-templates/governance.html';
import resourcesTemplate from '../common/step-templates/humanResources.html';
import awarenessTemplate from '../common/step-templates/awareness.html';
import securityTemplate from '../common/step-templates/security.html';
import accountingTemplate from '../common/step-templates/accounting.html';
import victimEngagementTemplate from '../common/step-templates/victimEngagement.html';
import recordsTemplate from '../common/step-templates/records.html';
import aftercareTemplate from '../common/step-templates/aftercare.html';
import paralegalTemplate from '../common/step-templates/paralegal.html';
import finalTemplate from '../common/step-templates/final.html';
import attachmentsTemplate from '../common/step-templates/attachments/attachment.html';

import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class MonthlyReportIndiaController extends BaseMonthlyReportController {
    constructor($scope, $uibModal, constants, MonthlyReportService, $stateParams, $state, SpinnerOverlayService, $uibModalStack) {
        'ngInject';        
        super($scope, $uibModal, constants, MonthlyReportService, $stateParams, $state,
                    [
                        "Governance",
                        "Human Resources",
                        "Awareness",
                        "Security",
                        "Accounting",
                        "Victim Engagement",
                        "Records",
                        "Aftercare",
                        "Paralegal"
                    ],
                    SpinnerOverlayService, $uibModalStack
                );
       
        this.stepTemplates = [
            {template:governanceTemplate, name:"Governance"},
            {template:resourcesTemplate, name:"Human Resources"},
            {template:awarenessTemplate, name:"Awareness"},
            {template:securityTemplate, name:"Security"},
            {template:accountingTemplate, name:"Accounting"},
            {template:victimEngagementTemplate, name:"Monitoring"},
            {template:recordsTemplate, name:"Records"},
            {template:aftercareTemplate, name:"Potential Victim Care"},
            {template:paralegalTemplate, name:"Paralegal"},
            {template:finalTemplate, name:"Final"},
            {template:attachmentsTemplate, name:"Attachments"}
        ];
        
        this.translateSectionName = {
            "Victim Engagement":"Monitoring",
            "Aftercare":"Potential Victim Care",
        }
        
        this.topMessage='Note: If a question does not apply, mark “n/a”.';
        
        this.governanceQuestions = [716,717,902];
        this.governanceCheckboxes = [718,719,720,721,944,945];
        this.resourcesQuestions = [731,732,903,733,734,735];
        this.awareQuestions = [739,740,741,"Materials",742,743,"Special",744,745,"HighValueContacts",797];
        this.securityQuestions = [749,750,751,752,753];
        this.accountingQuestions = [758,759,760,761];
        this.victimEngagementQuestions = [765,904,905,868];
        this.recordsQuestions = [769,869,770,771,772,793,947];
        this.aftercareQuestions = ["Education",776,777,870,778,871,872,909,"HTMessage",779,781,782,"Shelter",873,874,875,"Interviews",783,784,785,"Followup",786];
        this.paralegalQuestions = [790,791,876,792,877,906,907,995];
        
        this.questionFormat = {
            // Governance
            716: {
                enabled:true,
                type:"radio",
                prompt: "# of subcommittee mettings",
                promptFormat: "col-md-2 control-label",
                options: [
                    {label:"0",format:"col-md-1",points:0},
                    {label:"1",format:"col-md-1",points:20},
                    {label:"2",format:"col-md-1",points:30},
                    {label:">2",format:"col-md-1",points:40},
                ]
            },
            717: {
                enabled:true,
                type:"radio",
                prompt: "# of times SC visted station",
                promptFormat: "col-md-2 control-label",
                options: [
                    {label:"<10",format:"col-md-1",points:0},
                    {label:"10-20",format:"col-md-1",points:5},
                    {label:"20-30",format:"col-md-1",points:10},
                    {label:">30",format:"col-md-1",points:25},
                ]
            },
            902: {
                enabled:true,
                type:"radio",
                prompt: "3 Core Value Posters on display at station ",
                promptFormat: "col-md-2 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            718: {
                enabled:true,
                type:"checkbox",
                label:"Records",
                format:"col-md-2",
                points:5
                
            },
            719: {
                enabled:true,
                type:"checkbox",
                label:"Security",
                format:"col-md-2",
                points:5
                
            },
            720: {
                enabled:true,
                type:"checkbox",
                label:"Care",
                format:"col-md-2",
                points:5
                
            },
            721: {
                enabled:true,
                type:"checkbox",
                label:"Paralegal",
                format:"col-md-2",
                points:5
                
            },
            944: {
                enabled:true,
                type:"checkbox",
                label:"Awareness",
                format:"col-md-2",
                points:5
                
            },
            945: {
                enabled:true,
                type:"checkbox",
                label:"Accounting",
                format:"col-md-2",
                points:5
                
            },
            722: {
                enabled:true,
                type:"checkbox",
                label:"Station Investigator",
                format:"col-md-2",
                points:10
                
            },
            
            // Human Resources
            731: {
                enabled:true,
                type:"radio",
                prompt: "Staff hours per week",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"<40",format:"col-md-1",points:10},
                    {label:"40",format:"col-md-2",points:20},
                    {label:"41-50",format:"col-md-2",points:20},
                    {label:">50",format:"col-md-1",points:10},
                ]
            },
            732: {
                enabled:true,
                type:"radio",
                prompt: "Appointment Letter & Agreement Contract for all staff?",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            903: {
                enabled:true,
                type:"radio",
                prompt: "Corruption Policy Agreement Signed for all staff",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            733: {
                enabled:true,
                type:"radio",
                prompt: "Information on all staff provided to Regional Manager",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            734: {
                enabled:true,
                type:"radio",
                prompt: "Percent of staff who have taken and passed TM Knowledge Test and the Scenario Test",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"<30%",format:"col-md-1",points:0},
                    {label:"30-59%",format:"col-md-2",points:5},
                    {label:"60-99%",format:"col-md-2",points:10},
                    {label:"100%",format:"col-md-1",points:25},
                ]
            }, 
            735: {
                enabled:true,
                type:"radio",
                prompt: "Percent of Assistants who have passed Asistant Tests",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"<30%",format:"col-md-1",points:0},
                    {label:"30-59%",format:"col-md-2",points:5},
                    {label:"60-99%",format:"col-md-2",points:10},
                    {label:"100%",format:"col-md-1",points:15},
                ]
            }, 
            
            // Awareness
            Materials:{
                enabled:true,
                type:"header",
                prompt: "MATERIALS USED",
                promptFormat: "col-md-12 control-label heading",
            },
            Special:{
                enabled:true,
                type:"header",
                prompt: "SPECIAL EVENTS",
                promptFormat: "col-md-12 control-label heading",
            },
            739: {
                enabled:true,
                type:"radio",
                prompt: "Staff awareness hours",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<5",format:"col-md-1",points:0},
                    {label:"6-25",format:"col-md-2",points:5},
                    {label:"26-50",format:"col-md-2",points:10},
                    {label:">50",format:"col-md-2",points:15},
                ]
            },
            740: {
                enabled:true,
                type:"radio",
                prompt: "SC awareness hours",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<10",format:"col-md-1",points:0},
                    {label:"10-20",format:"col-md-2",points:5},
                    {label:"21-30",format:"col-md-2",points:8},
                    {label:">30",format:"col-md-2",points:10},
                ]
            }, 
            741: {
                enabled:true,
                type:"radio",
                prompt: "Phone calls from materials",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<10",format:"col-md-1",points:0},
                    {label:"10-20",format:"col-md-2",points:6},
                    {label:"21-30",format:"col-md-2",points:8},
                    {label:">30",format:"col-md-2",points:10},
                ]
            }, 
            742: {
                enabled:true,
                type:"radio",
                prompt: "Contact Cards",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<10",format:"col-md-1",points:0},
                    {label:"10-20",format:"col-md-2",points:5},
                    {label:">20",format:"col-md-2",points:8},
                ]
            }, 
            743: {
                enabled:true,
                type:"radio",
                prompt: "Brochures/Stickers/Posters",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<20",format:"col-md-1",points:0},
                    {label:"20-35",format:"col-md-2",points:5},
                    {label:"36-50",format:"col-md-2",points:9},
                    {label:">50",format:"col-md-2",points:12},
                ]
            }, 
            744: {
                enabled:true,
                type:"radio",
                prompt: "Most Recent Awareness Gathering",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:">1 year",format:"col-md-2",points:3},
                    {label:"6-12 months",format:"col-md-2",points:7},
                    {label:"3-6 months",format:"col-md-2",points:10},
                    {label:"<3 months",format:"col-md-2",points:15},
                ]
            },
            745: {
                enabled:true,
                type:"radio",
                prompt: "Most Recent Transportation Workers Gathering",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:">1 year",format:"col-md-2",points:2},
                    {label:"6-12 months",format:"col-md-2",points:6},
                    {label:"3-6 months",format:"col-md-2",points:8},
                    {label:"<3 months",format:"col-md-2",points:10},
                ]
            },
            
            // Security
            749: {
                enabled:true,
                type:"radio",
                prompt: "Security Protocol followed when taking victims to safe house",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:15},
                    {label:"always",format:"col-md-2",points:30},
                    {label:"n/a",format:"col-md-2",points:30},
                ]
            },
            750: {
                enabled:true,
                type:"radio",
                prompt: "Staff vary routes when traveling to the shelter / booth",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:10},
                    {label:"always",format:"col-md-2",points:15},
                    {label:"n/a",format:"col-md-2",points:15},
                ]
            },
            751: {
                enabled:true,
                type:"radio",
                prompt: "Staff frequently rotate shifts and locations",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            752: {
                enabled:true,
                type:"radio",
                prompt: "Staff vary clothing and appearance, dress to fit-in",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            753: {
                enabled:true,
                type:"radio",
                prompt: 'Were all threats reported?',
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:30},
                    {label:"n/a",format:"col-md-2",points:30},
                ]
            },
            754: {
                enabled:true,
                type:"radio",
                prompt: "If prior threat, staff have protection devices?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                    {label:"n/a",format:"col-md-2",points:10},
                ]
            },
            
            // Accounting
            758: {
                enabled:true,
                type:"radio",
                prompt: "Receipt & Voucher for all transactions",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:30},
                ]
            },
            759: {
                enabled:true,
                type:"radio",
                prompt: "All Transactions Listed in Daybook",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            760: {
                enabled:true,
                type:"radio",
                prompt: "Monthly Payment Record filled out, sent",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            761: {
                enabled:true,
                type:"radio",
                prompt: "Yearly Accounting Submitted to TH India by last March 31st",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:30},
                ]
            },
            
            // Victim Engagement
            765: {
                enabled:true,
                type:"radio",
                prompt: "Potential Victims questioned this month",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<50",format:"col-md-1",points:15},
                    {label:"51-150",format:"col-md-2",points:25},
                    {label:"151-300",format:"col-md-2",points:45},
                    {label:">300",format:"col-md-2",points:65},
                ]
            },
            904: {
                enabled:true,
                type:"radio",
                prompt: "When to intercept Posters displayed at station",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:20},
                ]
            },
            905: {
                enabled:true,
                type:"radio",
                prompt: "Freedom of Movement & Migration Posters displayed",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            
            // Records
            769: {
                enabled:true,
                type:"radio",
                prompt: "Station Logbooks filled out",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            770: {
                enabled:true,
                type:"radio",
                prompt: "IRF fully filled out and sent to TH for all intercepts",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            771: {
                enabled:true,
                type:"radio",
                prompt: "Photo percentage",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<70%",format:"col-md-1",points:0},
                    {label:"70-89%",format:"col-md-2",points:8},
                    {label:"90-99%",format:"col-md-2",points:10},
                    {label:"100%",format:"col-md-2",points:15},
                ]
            },
            772: {
                enabled:true,
                type:"radio",
                prompt: "VDF percentage",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<60%",format:"col-md-1",points:0},
                    {label:"60-79%",format:"col-md-2",points:10},
                    {label:"80-99%",format:"col-md-2",points:15},
                    {label:"100%",format:"col-md-2",points:20},
                ]
            },
            793: {
                enabled:true,
                type:"radio",
                prompt: "CIF % for Clear Evidence Cases",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<60%",format:"col-md-1",points:10},
                    {label:"60-79%",format:"col-md-2",points:15},
                    {label:"80-99%",format:"col-md-2",points:20},
                    {label:"100%",format:"col-md-2",points:25},
                    {label:"n/a",format:"col-md-2",points:25},
                ]
            },
            947: {
                enabled:true,
                type:"radio",
                prompt: '"Verified" phone numbers (victim / suspect) percentage',
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<60%",format:"col-md-1",points:5},
                    {label:"60-79%",format:"col-md-2",points:10},
                    {label:"80-99%",format:"col-md-2",points:15},
                    {label:"100%",format:"col-md-2",points:20},
                ]
            },
            
            // Aftercare
            Education:{
                enabled:true,
                type:"header",
                prompt: "EDUCATION",
                promptFormat: "col-md-12 control-label heading",
            },
            HTMessage:{
                enabled:true,
                type:"header",
                prompt: "H.T. MESSAGE",
                promptFormat: "col-md-12 control-label heading",
            },
            Shelter:{
                enabled:true,
                type:"header",
                prompt: "SHELTER",
                promptFormat: "col-md-12 control-label heading",
            },
            Interviews:{
                enabled:true,
                type:"header",
                prompt: "INTERVIEWS",
                promptFormat: "col-md-12 control-label heading",
            },
            Followup:{
                enabled:true,
                type:"header",
                prompt: "FOLLOW-UP",
                promptFormat: "col-md-12 control-label heading",
            },
            776: {
                enabled:true,
                type:"radio",
                prompt: "Chori",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            777: {
                enabled:true,
                type:"radio",
                prompt: "TDMGD",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            778: {
                enabled:true,
                type:"radio",
                prompt: "MTV Exit",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            779: {
                enabled:true,
                type:"radio",
                prompt: "Tracts Given",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:3},
                    {label:"76-99% of the time",format:"col-md-2",points:4},
                    {label:"100%",format:"col-md-2",points:10},
                ]
            },
            781: {
                enabled:true,
                type:"radio",
                prompt: "Messagebook Given",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:3},
                    {label:"76-99% of the time",format:"col-md-2",points:5},
                    {label:"100%",format:"col-md-2",points:15},
                ]
            },
            782: {
                enabled:true,
                type:"radio",
                prompt: "Redemption Movie",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:4},
                    {label:"100%",format:"col-md-2",points:15},
                ]
            },
            783: {
                enabled:true,
                type:"radio",
                prompt: "Interviews recorded w/victim's knowledge",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            784: {
                enabled:true,
                type:"radio",
                prompt: "All interviews in private room, max. 2 women",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            785: {
                enabled:true,
                type:"radio",
                prompt: "Discussion of a victims' case does not take place with anyone except TH India staff, SC members, and police (if necessary)",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            786: {
                enabled:true,
                type:"radio",
                prompt: "NGO in victims’ areas contacted",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            
            //Paralegal
            790: {
                enabled:true,
                type:"radio",
                prompt: "FIRs filed last month",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"0",format:"col-md-1",points:0},
                    {label:"1",format:"col-md-2",points:20},
                    {label:"2",format:"col-md-2",points:25},
                    {label:"3 or more",format:"col-md-2",points:30},
                ]
            },
            791: {
                enabled:true,
                type:"radio",
                prompt: "If filed case, did you scan & send copy of FIR to Regional HQ?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                    {label:"n/a",format:"col-md-2",points:10},
                ]
            },
            876: {
                enabled:true,
                type:"radio",
                prompt: "If active cases at Station, did you give monthly update to National Office on the progress of the case?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:40},
                    {label:"n/a",format:"col-md-2",points:40},
                ]
            },
            792: {
                enabled:false,
                type:"text",
                prompt: "# of CIFs filled out and submitted to National Office (in last month)",
                promptFormat: "col-md-3 control-label",
                // integer input
            },
            877: {
                enabled:true,
                type:"text",
                prompt: "Arrests last month",
                promptFormat: "col-md-3 control-label",
                // integer input
            },
            906: {
                enabled:false,
                type:"text",
                prompt: "GDs last month",
                promptFormat: "col-md-3 control-label",
            },
            907: {
                enabled:true,
                type:"radio",
                prompt: "When to File a Case poster displayed at station",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            995: {
                enabled:true,
                type:"radio",
                prompt: "A Legal Advisor has been appointed",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            
            
            // Investigations
            HighValueContacts:{
                enabled:true,
                type:"header",
                prompt: "HIGH VALUE CONTACTS",
                promptFormat: "col-md-12 control-label heading",
            },
            797: {
                enabled:true,
                type:"radio",
                prompt: "# of HVCs",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<2",format:"col-md-1",points:0},
                    {label:"3-5",format:"col-md-2",points:15},
                    {label:">5",format:"col-md-2",points:20},
                ]
            },
            798: {
                enabled:true,
                type:"radio",
                prompt: "Int from HVCs",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"None",format:"col-md-1",points:0},
                    {label:"<15%",format:"col-md-2",points:15},
                    {label:"15-30%",format:"col-md-2",points:25},
                    {label:">30%",format:"col-md-2",points:40},
                ]
            },
            799: {
                enabled:true,
                type:"radio",
                prompt: "How many times visited hotels?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<6",format:"col-md-1",points:0},
                    {label:"6-20",format:"col-md-2",points:15},
                    {label:">20",format:"col-md-2",points:25},
                ]
            },
        };
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: MonthlyReportIndiaController
};
