import sharedModule from '../shared/shared.module';
import SfCommonModuleV2022_6 from './commonV2022_6/sf.commonV2022_6.module';


import SfRoutes from './sf.route';
import SfService from './sf.service';

import SfListController from './list/sfList.controller';

import SfListService from './list/sfList.service';

/* global angular */

export default angular.module('tinyhands.SF', [SfCommonModuleV2022_6, sharedModule])
    .config(SfRoutes)
    .controller('SfListController', SfListController)
    .service('SfListService', SfListService)
    .service('SfService', SfService)
    .name;
