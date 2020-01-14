import {BaseMonthlyReportController} from '../baseMonthlyReportController.js';
import './nepal.less';

import templateUrl from './nepal.html';

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

export class MonthlyReportNepalController extends BaseMonthlyReportController {
    constructor($scope, constants, MonthlyReportService, $stateParams, $state, SpinnerOverlayService) {
        'ngInject';        
        super($scope, constants, MonthlyReportService, $stateParams, $state,
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
                    SpinnerOverlayService
                );
       
        this.stepTemplates = [
            governanceTemplate,
            logisticsTemplate,
            resourcesTemplate,
            awarenessTemplate,
            securityTemplate,
            accountingTemplate,
            victimEngagementTemplate,
            recordsTemplate,
            aftercareTemplate,
            paralegalTemplate,
            investigationsTemplate,
            finalTemplate
        ];
        
        this.questionFormat = {
            // Governance
            716: {
                enabled:true,
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
                prompt: "3 Core Value Posters on display at station ",
                promptFormat: "col-md-2 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            718: {
                enabled:true,
                label:"Records",
                format:"col-md-2",
                points:10
                
            },
            719: {
                enabled:true,
                label:"Security",
                format:"col-md-2",
                points:10
                
            },
            720: {
                enabled:true,
                label:"Aftercare",
                format:"col-md-2",
                points:10
                
            },
            721: {
                enabled:true,
                label:"Paralegal",
                format:"col-md-2",
                points:10
                
            },
            722: {
                enabled:true,
                label:"Station Investigator",
                format:"col-md-2",
                points:10
                
            },
            
            // Logistics & Registration
            864: {
                enabled:true,
                prompt: "Submitting Progress Reports to CDO",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            865: {
                enabled:true,
                prompt: "Submitting Progress Reports to Municipality and rural Municipality",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            866: {
                enabled:true,
                prompt: "Submitting Progress Reports Ward Office",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            867: {
                enabled:true,
                prompt: "Submitting Progress Reports to Police",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:25},
                ]
            },
            
            
            // Human Resources
            731: {
                enabled:true,
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
                prompt: "Appointment Letter & Agreement Contract for all staff?",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            903: {
                enabled:true,
                prompt: "Mismanagement Policy Agreement Signed for all staff",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            733: {
                enabled:true,
                prompt: "Information on all staff provided to National Office",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            734: {
                enabled:true,
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
            739: {
                enabled:true,
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
                prompt: "Security Protocol followed when taking victims to safe house / church",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:15},
                    {label:"always",format:"col-md-2",points:30},
                ]
            },
            750: {
                enabled:true,
                prompt: "Staff vary routes when traveling to the shelter / church / booth",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"never",format:"col-md-1",points:0},
                    {label:"<50% of the time",format:"col-md-2",points:5},
                    {label:">50% of the time",format:"col-md-2",points:7},
                    {label:"always",format:"col-md-2",points:15},
                ]
            },
            751: {
                enabled:true,
                prompt: "Staff frequently rotate shifts and locations",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            752: {
                enabled:true,
                prompt: "Staff vary clothing and appearance, dress to fit-in",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            753: {
                enabled:true,
                prompt: 'Were all threats reported? (mark "yes" if no threats)',
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:30},
                ]
            },
            754: {
                enabled:false,
                prompt: "If prior threat, staff have protection devices?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes/no threats",format:"col-md-2",points:10},
                ]
            },
            
            // Accounting
            758: {
                enabled:true,
                prompt: "Receipt & Voucher for all transactions",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:30},
                ]
            },
            759: {
                enabled:true,
                prompt: "All Transactions Listed in Daybook",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            760: {
                enabled:true,
                prompt: "Completed most recent Quarterly Payment Record",
                promptFormat: "col-md-4 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:20},
                ]
            },
            761: {
                enabled:true,
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
                prompt: "When to intercept Posters displayed at station",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:20},
                ]
            },
            905: {
                enabled:true,
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
                prompt: "Station Logbooks filled out",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            869: {
                enabled:true,
                prompt: "Shelter Logbooks filled out",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:5},
                ]
            },
            770: {
                enabled:true,
                prompt: "IRF fully filled out and sent to TH for all intercepts",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:15},
                ]
            },
            771: {
                enabled:true,
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
            776: {
                enabled:true,
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
                enabled:true,
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
                enabled:true,
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
                enabled:true,
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
                enabled:true,
                prompt: "Top Jobs for Women",
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
                prompt: "Tracts Given",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:4},
                    {label:"100%",format:"col-md-2",points:5},
                ]
            },
            781: {
                enabled:true,
                prompt: "Messagebook Given",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:3},
                    {label:"76-99% of the time",format:"col-md-2",points:5},
                    {label:"100%",format:"col-md-2",points:7},
                ]
            },
            782: {
                enabled:true,
                prompt: "Redemption Movie",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"<25%",format:"col-md-1",points:0},
                    {label:"25-75% of the time",format:"col-md-2",points:2},
                    {label:"76-99% of the time",format:"col-md-2",points:4},
                    {label:"100%",format:"col-md-2",points:6},
                ]
            },
            873: {
                enabled:true,
                prompt: "Only female THN staff enter the shelter",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:11},
                ]
            },
            874: {
                enabled:true,
                prompt: "1 staff / SC in shelter at all times (only if there is victim)",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:9},
                ]
            },
            875: {
                enabled:true,
                prompt: "Victims being tested for STDs, when appropriate",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:4},
                ]
            },
            783: {
                enabled:true,
                prompt: "Interviews recorded w/victim's knowledge",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:7},
                ]
            },
            784: {
                enabled:true,
                prompt: "All interviews in private room, max. 2 women",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            785: {
                enabled:true,
                prompt: "Discussion of a victims' case does not take place with anyone except TH Nepal staff, SC members, and police (if necessary)",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:8},
                ]
            },
            786: {
                enabled:true,
                prompt: "NGO in victims’ areas contacted",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:12},
                ]
            },
            
            //Paralegal
            790: {
                enabled:true,
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
                prompt: "If filed case, did you scan & send copy of FIR to Regional HQ?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:10},
                ]
            },
            876: {
                enabled:true,
                prompt: "If active cases at Station, did you give monthly update to National Office on the progress of the case?",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:40},
                ]
            },
            792: {
                enabled:false,
                // integer input
            },
            877: {
                enabled:true,
                // integer input
            },
            907: {
                enabled:true,
                prompt: "When to File a Case poster displayed at station",
                promptFormat: "col-md-3 control-label",
                options: [
                    {label:"no",format:"col-md-1",points:0},
                    {label:"yes",format:"col-md-2",points:20},
                ]
            },
            
            // Investigations
            797: {
                enabled:true,
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
                prompt: "INT from HVCs",
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
}

export default {
    templateUrl,
    controller: MonthlyReportNepalController
};
