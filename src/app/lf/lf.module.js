import sharedModule from '../shared/shared.module';
import LfCommonModuleV2022_6 from './commonV2022_6/lf.commonV2022_6.module';


import LfRoutes from './lf.route';
import LfService from './lf.service';

import LfListController from './list/lfList.controller';

import LfListService from './list/lfList.service';

/* global angular */

export default angular.module('tinyhands.LF', [LfCommonModuleV2022_6, sharedModule])
    .config(LfRoutes)
    .controller('LfListController', LfListController)
    .service('LfListService', LfListService)
    .service('LfService', LfService)
    .name;
