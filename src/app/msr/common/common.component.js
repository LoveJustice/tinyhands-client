import {BaseMsrController} from '../baseMsrController.js';
import './common.less';

import templateUrl from './common.html';

import governanceTemplate from './step-templates/governance.html';
import logisticsTemplate from './step-templates/logisticsRegistration.html';
import resourcesTemplate from './step-templates/humanResources.html';
import awarenessTemplate from './step-templates/awareness.html';
import securityTemplate from './step-templates/security.html';
import accountingTemplate from './step-templates/accounting.html';
import victimEngagementTemplate from './step-templates/victimEngagement.html';
import recordsTemplate from './step-templates/records.html';
import aftercareTemplate from './step-templates/aftercare.html';
import paralegalTemplate from './step-templates/paralegal.html';
import investigationsTemplate from './step-templates/investigations.html';
import finalTemplate from './step-templates/final.html';

export class MsrCommonController extends BaseMsrController {
    constructor($scope, constants, $stateParams, $state) {
        'ngInject';        
        super($scope, constants, $stateParams, $state);
       
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
        
        this.contexts = [
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
        ];
        
        this.stateParams.isViewing = false;
    }
    
    getAverageScore() {
        let total = 0;
        for (let contextIdx in this.contexts) {
            total += this.getContextCount(this.contexts[contextIdx]);
        }
        return Math.round(total/this.contexts.length * 100)/100
    }
}

export default {
    templateUrl,
    controller: MsrCommonController
};
