import sharedModule from '../shared/shared.module';
import PvfCommonModuleV2022_6 from './commonV2022_6/pvf.commonV2022_6.module';


import PvfRoutes from './pvf.route';
import PvfService from './pvf.service';

import PvfListController from './list/pvfList.controller';

import PvfListService from './list/pvfList.service';

/* global angular */

export default angular.module('tinyhands.PVF', [PvfCommonModuleV2022_6, sharedModule])
    .config(PvfRoutes)
    .controller('PvfListController', PvfListController)
    .service('PvfListService', PvfListService)
    .service('PvfService', PvfService)
    .name;
