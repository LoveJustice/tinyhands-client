import sharedModule from '../shared/shared.module';
import MsrCommonModule from './common/msr.common.module';

import MsrRoutes from './msr.route';
//import MsrService from './msr.service';

import MsrListController from './list/msrList.controller';
//import CreateMsrModalController from './list/createMsrModal.controller';

//import MsrListService from './list/msrList.service';

/* global angular */

export default angular.module('tinyhands.MSR', [MsrCommonModule, sharedModule])
    .config(MsrRoutes)
    .controller('MsrListController', MsrListController)
//    .service('MsrListService', MsrListService)
//    .controller('CreateMsrModalController', CreateMsrModalController)
//    .service('MsrService', MsrService)
    .name;
