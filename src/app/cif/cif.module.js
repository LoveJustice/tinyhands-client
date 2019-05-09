import sharedModule from '../shared/shared.module';
import CifNepalModule from './nepal/cif.nepal.module';
import CifIndiaModule from './india/cif.india.module';
import CifBangladeshModule from './bangladesh/cif.bangladesh.module';

import CifRoutes from './cif.route';
import CifService from './cif.service';

import CifListController from './list/cifList.controller';
import CreateCifModalController from './list/createCifModal.controller';

import CifListService from './list/cifList.service';

/* global angular */

export default angular.module('tinyhands.CIF', [CifNepalModule, CifIndiaModule, CifBangladeshModule, sharedModule])
    .config(CifRoutes)
    .controller('CifListController', CifListController)
    .service('CifListService', CifListService)
    .controller('CreateCifModalController', CreateCifModalController)
    .service('CifService', CifService)
    .name;