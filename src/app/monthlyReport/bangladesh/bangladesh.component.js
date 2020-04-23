import {BaseMonthlyReportController} from '../baseMonthlyReportController.js';
import {BaseModalController} from '../../baseModalController.js';
import '../common/monthlyReport.less';

import templateUrl from '../common/monthlyReport.html';

import governanceTemplate from '../common/step-templates/governance.html';
import logisticsTemplate from '../common/step-templates/logisticsRegistration.html';
import resourcesTemplate from '../common/step-templates/humanResources.html';
import awarenessTemplate from '../common/step-templates/awareness.html';
import securityTemplate from '../common/step-templates/security.html';
import accountingTemplate from '../common/step-templates/accounting.html';
import victimEngagementTemplate from '../common/step-templates/victimEngagement.html';
import recordsTemplate from '../common/step-templates/records.html';
import aftercareTemplate from '../common/step-templates/aftercare.html';
import paralegalTemplate from '../common/step-templates/paralegal.html';
import investigationsTemplate from '../common/step-templates/investigations.html';
import finalTemplate from '../common/step-templates/final.html';
import attachmentsTemplate from '../common/step-templates/attachments/attachment.html';

import attachmentTemplate from '../common/step-templates/attachments/attachmentModal.html';

export class MonthlyReportBangladeshController extends BaseMonthlyReportController {
    constructor($scope, $uibModal, constants, MonthlyReportService, $stateParams, $state, SpinnerOverlayService, $uibModalStack) {
        'ngInject';        
        super($scope, $uibModal, constants, MonthlyReportService, $stateParams, $state,
                    [
                        "Governance",
                        "Logistics & Registration",
                        "Human Resources",
                        "Awareness",
                        "Security",
                        "Accounting",
                        "Victim Engagement",
                        "Records",
                        "Aftercare",
                        "Paralegal",
                        "Investigations"
                    ],
                    SpinnerOverlayService, $uibModalStack
                );
       
        this.stepTemplates = [
            {template:governanceTemplate, name:"Governance"},
            {template:logisticsTemplate, name:"Logistics & Registration"},
            {template:resourcesTemplate, name:"Human Resources"},
            {template:awarenessTemplate, name:"Awareness"},
            {template:securityTemplate, name:"Security"},
            {template:accountingTemplate, name:"Accounting"},
            {template:victimEngagementTemplate, name:"Victim Engagement"},
            {template:recordsTemplate, name:"Records"},
            {template:aftercareTemplate, name:"Aftercare"},
            {template:paralegalTemplate, name:"Paralegal"},
            {template:investigationsTemplate, name:"Investigations"},
            {template:finalTemplate, name:"Final"},
            {template:attachmentsTemplate, name:"Attachments"}
        ];
        
        this.governanceQuestions = [716,717,902];
        this.governanceCheckboxes = [718,719,720,721,722];
        this.logisticsQuestions = ["IncludeTMS",908];
        this.resourcesQuestions = [731,732,903,733,734,735];
        this.awareQuestions = [739,740,741,"Materials",742,743,"Special",744,745];
        this.securityQuestions = [749,750,751,752,753,754];
        this.accountingQuestions = [758,759,760,761];
        this.victimEngagementQuestions = [765,904,905,868];
        this.recordsQuestions = [769,869,770,771,772,793];
        this.aftercareQuestions = ["Education",776,777,870,778,871,872,909,"HTMessage",779,781,782,"Shelter",873,874,875,"Interviews",783,784,785,"Followup",786];
        this.paralegalQuestions = [790,791,876,792,877,906,907];
        this.investigationsQuestions = ["HighValueContacts",797,798,799];
        
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
                    {label:">30",format:"col-md-1",points:20},
                ]
            },
            902: {
                enabled:true,
                type:"radio",
                prompt: "3 Core Value Posters on display at station ",
                promptFormat: "col-md-2 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            718: {
                enabled:true,
                type:"checkbox",
                label:"Records",
                format:"col-md-2",
                points:10
                
            },
            719: {
                enabled:true,
                type:"checkbox",
                label:"Security",
                format:"col-md-2",
                points:10
                
            },
            720: {
                enabled:true,
                type:"checkbox",
                label:"Aftercare",
                format:"col-md-2",
                points:10
                
            },
            721: {
                enabled:true,
                type:"checkbox",
                label:"Paralegal",
                format:"col-md-2",
                points:10
                
            },
            722: {
                enabled:true,
                type:"checkbox",
                label:"Station Investigator",
                format:"col-md-2",
                points:10
                
            },
            
            // Logistics & Registration
            IncludeTMS:{
                enabled:true,
                type:"header",
                prompt: "[include any requirements included in the TMS]",
                promptFormat: "col-md-12 control-label",
            },
            908: {
                enabled:true,
                type:"radio",
                prompt: "Submitting reports &amp; attend Govt. Monthly NGO Meetings",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:100},
                ]
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
                prompt: "Anti-Corruption Policy Agreement Signed by all staff and SC",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            733: {
                enabled:true,
                type:"radio",
                prompt: "Information on all staff provided to National Office",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            734: {
                enabled:true,
                type:"radio",
                prompt: "Percent of staff who have taken and passed TMS Exam",
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
                prompt: "Percent of coordinators who have passed Coordinator Exams",
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
                    {label:"6-25",format:"col-md-2",points:8},
                    {label:"26-50",format:"col-md-2",points:15},
                    {label:">50",format:"col-md-2",points:25},
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
                    {label:"21-30",format:"col-md-2",points:10},
                    {label:">30",format:"col-md-2",points:20},
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
                prompt: "Security Protocol followed when taking victims to safe house / church",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:15},
                    {label:"always",format:"col-md-2",points:22},
                ]
            },
            750: {
                enabled:true,
                type:"radio",
                prompt: "Staff vary routes when traveling to the shelter / church / booth",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:7},
                    {label:"always",format:"col-md-2",points:10},
                ]
            },
            751: {
                enabled:true,
                type:"radio",
                prompt: "Staff frequently rotate shifts and locations",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:13},
                ]
            },
            752: {
                enabled:true,
                type:"radio",
                prompt: "Staff vary clothing and appearance, dress to fit-in",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            753: {
                enabled:true,
                type:"radio",
                prompt: 'Were all threats reported? (mark "yes" if no threats)',
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            754: {
                enabled:true,
                type:"radio",
                prompt: "If prior threat, staff have protection devices?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes/no threats",format:"col-md-2",points:20},
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
                    {label:"yes",format:"col-md-2",points:50},
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
                prompt: "Monthly Payment Record filled out, sent ",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:35},
                ]
            },
            761: {
                enabled:false,
                type:"radio",
                prompt: "Yearly Accounting Submitted to THN by last Shrawan 15",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:35},
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
            868: {
                enabled:false,
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
            869: {
                enabled:true,
                type:"radio",
                prompt: "Shelter Logbooks filled out",
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
                    {label:"70-89% of the time",format:"col-md-2",points:8},
                    {label:"90-99% of the time",format:"col-md-2",points:10},
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
                    {label:"60-79% of the time",format:"col-md-2",points:10},
                    {label:"80-99% of the time",format:"col-md-2",points:20},
                    {label:"100%",format:"col-md-2",points:30},
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
                    {label:"100%",format:"col-md-2",points:30},
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
                enabled:false,
                type:"radio",
                prompt: "Chori",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:4},
                ]
            },
            777: {
                enabled:false,
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
            870: {
                enabled:false,
                type:"radio",
                prompt: "Dhuwani",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            778: {
                enabled:false,
                type:"radio",
                prompt: "MTV Exit",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:4},
                ]
            },
            871: {
                enabled:false,
                type:"radio",
                prompt: "Nepalese Homes video",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:1},
                    {label:"76-99% of the time",format:"col-md-2",points:2},
                    {label:"100%",format:"col-md-2",points:3},
                ]
            },
            872: {
                enabled:false,
                type:"radio",
                prompt: "Top Jobs for Women",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:3},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            909: {
                enabled:true,
                type:"radio",
                prompt: "Good Touch & Bad Touch ",
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
                    {label:"25-75% of the time",format:"col-md-2",points:4},
                    {label:"76-99% of the time",format:"col-md-2",points:7},
                    {label:"100%",format:"col-md-2",points:10},
                ]
            },
            781: {
                enabled:true,
                type:"radio",
                prompt: "Bibles Given",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:4},
                    {label:"76-99% of the time",format:"col-md-2",points:7},
                    {label:"100%",format:"col-md-2",points:10},
                ]
            },
            782: {
                enabled:true,
                type:"radio",
                prompt: "Jesus Film",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:4},
                    {label:"76-99% of the time",format:"col-md-2",points:7},
                    {label:"100%",format:"col-md-2",points:10},
                ]
            },
            873: {
                enabled:true,
                type:"radio",
                prompt: "Only female LJ staff enter the shelter",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            874: {
                enabled:true,
                type:"radio",
                prompt: "1 staff / SC in shelter at all times (only if there is victim)",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            875: {
                enabled:true,
                type:"radio",
                prompt: "Victims being tested for STDs, when appropriate",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            783: {
                enabled:true,
                type:"radio",
                prompt: "Interviews recorded w/victim's knowledge",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            784: {
                enabled:true,
                type:"radio",
                prompt: "All interviews in private room, max. 2 women",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            785: {
                enabled:true,
                type:"radio",
                prompt: "Discussion of a victims' case does not take place with anyone except TH Nepal staff, SC members, and police (if necessary)",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            786: {
                enabled:true,
                type:"radio",
                prompt: "Church/NGO in victims’ areas contacted",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            
            //Paralegal
            790: {
                enabled:true,
                type:"radio",
                prompt: "Cases filed last month",
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
                prompt: "If filed case, did you scan & send copy of charge sheet to National Office? ",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
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
                enabled:true,
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
                    {label:"yes",format:"col-md-2",points:20},
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
                    {label:">5",format:"col-md-2",points:35},
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
    controller: MonthlyReportBangladeshController
};
