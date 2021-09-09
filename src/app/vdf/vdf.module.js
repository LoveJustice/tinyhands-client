import sharedModule from '../shared/shared.module';
import VdfCommonModule from './common/vdf.common.module';
import VdfCommonModuleV2 from './commonV2/vdf.commonV2.module';
import VdfCommonModuleV2021_6 from './commonV2021_6/vdf.commonV2021_6.module';


import VdfRoutes from './vdf.route';
import VdfService from './vdf.service';

import VdfListController from './list/vdfList.controller';
import CreateVdfModalController from './list/createVdfModal.controller';

import VdfListService from './list/vdfList.service';

/* global angular */

export default angular.module('tinyhands.VDF', [VdfCommonModule, VdfCommonModuleV2, VdfCommonModuleV2021_6, sharedModule])
    .config(VdfRoutes)
    .controller('VdfListController', VdfListController)
    .service('VdfListService', VdfListService)
    .controller('CreateVdfModalController', CreateVdfModalController)
    .service('VdfService', VdfService)
    .name;
