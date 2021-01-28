import {BaseIrfController} from './baseIrfController.js';
import './common/irf.less';

import topBoxTemplate from './common/step-templates/topBox.html';
import profileTemplate from './common/step-templates/profile.html';
import areaIndustryTemplate from './common/step-templates/areaIndustry.html';
import resourceSafetyTemplate from './common/step-templates/resourceSafety.html';
import controlTemplate from './common/step-templates/control.html';
import noticedTemplate from './common/step-templates/noticed.html';
import intercepteesTemplate from './common/step-templates/interceptees/people.html';
import finalProceduresTemplate from './common/step-templates/finalProcedures.html';
import attachmentsTemplate from './common/step-templates/attachments/attachment.html';
import complianceTemplate from './common/step-templates/compliance.html';
import verificationTemplate from './common/step-templates/verification.html';

export class BaseIrfCommonController extends BaseIrfController {
	constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
		'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
        
        this.stepTemplates = [
            {template:topBoxTemplate, name:"Top"},
            {template:profileTemplate, name:"Profile"},
            {template:areaIndustryTemplate, name:"Area/Industry"},
            {template:resourceSafetyTemplate, name:"Resources"},
            {template:controlTemplate, name:"Control"},
            {template:noticedTemplate, name:"Contact/Staff"},
            {template:intercepteesTemplate, name:"People"},
            {template:finalProceduresTemplate, name:"Reason"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:complianceTemplate, name:"Compliance"},
            {template:verificationTemplate, name:"Verification"},
        ];
	}
}

export default {
	BaseIrfCommonController
};