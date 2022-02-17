import sharedModule from '../shared/shared.module';

import GspRoutes from './gsp.route';
import GspService from './gsp.service';

import GspListController from './list/gspList.controller';
import CreateGspModalController from './list/createGspModal.controller';

import GspListService from './list/gspList.service';
import GspController from './gsp.controller';

/* global angular */

export default angular.module('tinyhands.EMP', [sharedModule])
    .config(GspRoutes)
    .controller('GspListController', GspListController)
    .controller('GspController', GspController)
    .service('GspListService', GspListService)
    .controller('CreateGspModalController', CreateGspModalController)
    .service('GspService', GspService)
    .name;
