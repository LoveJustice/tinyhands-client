import sharedModule from '../shared/shared.module';
import VdfNepalModule from './nepal/vdf.nepal.module';

import VdfRoutes from './vdf.route';
import VdfService from './vdf.service';

import VdfListController from './list/vdfList.controller';
import CreateVdfModalController from './list/createVdfModal.controller';

import VdfListService from './list/vdfList.service';

/* global angular */

export default angular.module('tinyhands.VDF', [VdfNepalModule, sharedModule])
    .config(VdfRoutes)
    .controller('VdfListController', VdfListController)
    .service('VdfListService', VdfListService)
    .controller('CreateVdfModalController', CreateVdfModalController)
    .service('VdfService', VdfService)
    .name;
