import LegalCaseCommonComponent from './common.component';

import LegalCaseCommonRoutes from './legalCase.common.route';

/* global angular */

export default angular.module('tinyhands.Legal.common', [])
    .config(LegalCaseCommonRoutes)
    .component('legalCaseCommonComponent', LegalCaseCommonComponent)
    .name;