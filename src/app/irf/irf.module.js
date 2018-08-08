import sharedModule from '../shared/shared.module';
import IrfBangladeshModule from './bangladesh/irf.bangladesh.module';
import IrfIndiaModule from './india/irf.india.module';
import IrfNepalModule from './nepal/irf.nepal.module';
import IrfSouthAfricaModule from './south-africa/irf.southAfrica.module';
import IrfBangladeshModule from './bangladesh/irf.bangladesh.module';

import IrfRoutes from './irf.route';

import IrfListController from './list/irfList.controller';

import IrfListService from './list/irfList.service';

import IrfNewListController from './newList/irfNewList.controller';
import CreateIrfModalController from './newList/createIrfModal.controller';

import IrfNewListService from './newList/irfNewList.service';

/* global angular */

export default angular.module('tinyhands.IRF', [IrfIndiaModule, IrfNepalModule, IrfSouthAfricaModule, IrfBangladeshModule, sharedModule])
    .config(IrfRoutes)
    .controller('IrfListController', IrfListController)
    .service('IrfListService', IrfListService)
    .controller('IrfNewListController', IrfNewListController)
    .controller('CreateIrfModalController', CreateIrfModalController)
    .service('IrfNewListService', IrfNewListService)
    .name;