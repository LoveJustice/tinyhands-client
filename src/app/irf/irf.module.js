import SharedModule from '../shared/shared.module';

import IRFRoutes from './irf.route';

import IrfListService from './list/irfList.service';

import IrfListController from './list/irfList.controller';

export default angular.module('tinyhands.IRF', ['ui.router', 'tinyhands.Shared'])
    .config(IRFRoutes)
    
    .service('IrfListService', IrfListService)
    
    .controller('IrfListController', IrfListController);

    