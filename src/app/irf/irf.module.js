import sharedModule from '../shared/shared.module';
import IrfIndiaModule from './india/irf.india.module';

import IrfRoutes from './irf.route';

import IrfListController from './list/irfList.controller';

import IrfListService from './list/irfList.service';

export default angular.module('tinyhands.IRF', [IrfIndiaModule, sharedModule])
    .config(IrfRoutes)
    .controller('IrfListController', IrfListController)
    .service('IrfListService', IrfListService)
    .name;