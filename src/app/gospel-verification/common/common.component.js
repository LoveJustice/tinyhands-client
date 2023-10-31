import {BaseGospelVerificationController} from '../baseGospelVerification.controller.js';
import './common.less';

import templateUrl from './common.html?url';

export class GospelVerificationCommonController extends BaseGospelVerificationController {
    constructor($scope, GospelVerificationService, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';        
        super($scope, GospelVerificationService, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService);
    }
}

export default {
    templateUrl,
    controller: GospelVerificationCommonController
};
