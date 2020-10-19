import sharedModule from '../shared/shared.module';
import LegalCaseCommonModule from './common/legalCase.common.module';


import LegalCaseRoutes from './legalCase.route';
import LegalCaseService from './legalCase.service';

import LegalCaseListController from './list/legalCaseList.controller';
import CreateLegalCaseModalController from './list/createLegalCaseModal.controller';

import LegalCaseListService from './list/legalCaseList.service';

/* global angular */

export default angular.module('tinyhands.LegalCase', [LegalCaseCommonModule, sharedModule])
    .config(LegalCaseRoutes)
    .controller('LegalCaseListController', LegalCaseListController)
    .service('LegalCaseListService', LegalCaseListService)
    .controller('CreateLegalCaseModalController', CreateLegalCaseModalController)
    .service('LegalCaseService', LegalCaseService)
    .name;
