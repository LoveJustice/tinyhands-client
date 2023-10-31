import {BaseVdfController} from '../baseVdfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './commonV2021_6.less';

import templateUrl from './commonV2021_6.html?url';
import topTemplate from './step-templates/top.html?url';
import victimTemplate from './step-templates/victim.html?url';
import homeAssessmentTemplate from './step-templates/homeAssessment.html?url';
import awarenessTemplate from './step-templates/awareness.html?url';
import releaseTemplate from './step-templates/release.html?url';
import finalTemplate from './step-templates/final.html?url';
import attachmentsTemplate from './step-templates/attachments/attachment.html?url';
import logbookTemplate from './step-templates/logbook.html?url';

import attachmentTemplate from './step-templates/attachments/attachmentModal.html?url';

export class VdfCommonV3Controller extends BaseVdfController {
    constructor($scope, $uibModal, constants, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';        
        super($scope, $uibModal, constants, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);

        this.stepTemplates = [
            topTemplate,
            victimTemplate,
            homeAssessmentTemplate,
            awarenessTemplate,
            releaseTemplate,
            finalTemplate,
            attachmentsTemplate,
            logbookTemplate
        ];
    }
    
    openAttachmentModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'AttachmentModalController',
                attachmentTemplate, 'Attachments');
    }
}

export default {
    templateUrl,
    controller: VdfCommonV3Controller
};
