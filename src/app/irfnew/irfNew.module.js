import sharedModule from '../shared/shared.module';

import IRFNewRoutes from './irfNew.route';

import IrfNewListController from './list/irfNewList.controller';
import CreateIrfModalController from './list/createIrfModal.controller';

import IrfNewListService from './list/irfNewList.service';

export default angular.module('tinyhands.IRFNew', [sharedModule])
    .config(IRFNewRoutes)
    .controller('IrfNewListController', IrfNewListController)
    .controller('CreateIrfModalController', CreateIrfModalController)
    .service('IrfNewListService', IrfNewListService)
    .name;