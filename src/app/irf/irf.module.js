import sharedModule from '../shared/shared.module';
import IrfBangladeshModule from './bangladesh/irf.bangladesh.module';
import IrfIndiaModule from './india/irf.india.module';
import IrfNepalModule from './nepal/irf.nepal.module';
import IrfSouthAfricaModule from './south-africa/irf.southAfrica.module';

import IrfRoutes from './irf.route';

import IrfListController from './list/irfList.controller';

import IrfListService from './list/irfList.service';

export default angular.module('tinyhands.IRF', [IrfBangladeshModule, IrfIndiaModule, IrfNepalModule, IrfSouthAfricaModule, sharedModule])
    .config(IrfRoutes)
    .controller('IrfListController', IrfListController)
    .service('IrfListService', IrfListService)
    .name;