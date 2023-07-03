import sharedModule from '../shared/shared.module';

import mdfRouteConfig from './mdf.route';

import MdfListController from './list/mdfList.controller';
import CreateMdfModalController from './list/createMdfModal.controller';

import MdfController from './mdf.controller';

import MdfListService from './list/mdfList.service';
import MdfService from './mdf.service';

export default angular.module('tinyhands.Mdf', [sharedModule])
    .config(mdfRouteConfig)

    .controller('MdfListController', MdfListController)
    .controller('CreateMdfModalController', CreateMdfModalController)
    .controller('MdfController', MdfController)

    .service('MdfListService', MdfListService)
    .service('MdfService', MdfService)
    .name;