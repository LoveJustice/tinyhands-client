import sharedModule from '../shared/shared.module';
import CifNepalModule from './nepal/cif.nepal.module';

import CifRoutes from './cif.route';
import CifService from './cif.service';

import CifListController from './list/cifList.controller';
import CreateCifModalController from './list/createCifModal.controller';

import CifListService from './list/cifList.service';

/* global angular */

export default angular.module('tinyhands.CIF', [CifNepalModule, sharedModule])
    .config(CifRoutes)
    .controller('CifListController', CifListController)
    .service('CifListService', CifListService)
    .controller('CreateCifModalController', CreateCifModalController)
    .service('CifService', CifService)
    .name;