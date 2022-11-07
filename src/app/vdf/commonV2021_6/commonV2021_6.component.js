import {BaseVdfController} from '../baseVdfController.js';
import {BaseModalController} from '../../baseModalController.js';
import './commonV2021_6.less';

import templateUrl from './commonV2021_6.html';
import topTemplate from './step-templates/top.html';
import victimTemplate from './step-templates/victim.html';
import homeAssessmentTemplate from './step-templates/homeAssessment.html';
import awarenessTemplate from './step-templates/awareness.html';
import releaseTemplate from './step-templates/release.html';
import finalTemplate from './step-templates/final.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';
import logbookTemplate from './step-templates/logbook.html';

import attachmentTemplate from './step-templates/attachments/attachmentModal.html';

export class VdfCommonV3Controller extends BaseVdfController {
    constructor($scope, $uibModal, constants, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';        
        super($scope, $uibModal, constants, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
       this.sourceOptions = [
            'Intercept', 'Operation',
            'Victim', 'Police',
            'Trafficker', 'OSI'
        ];
        this.stepTemplates = [
            victimTemplate,
            homeAssessmentTemplate,
            awarenessTemplate
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
