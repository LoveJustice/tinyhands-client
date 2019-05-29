import sharedModule from '../shared/shared.module';
import IrfBangladeshModule from './bangladesh/irf.bangladesh.module';
import IrfIndiaModule from './india/irf.india.module';
import IrfMalawiModule from './malawi/irf.malawi.module';
import IrfNepalModule from './nepal/irf.nepal.module';
import IrfSouthAfricaModule from './south-africa/irf.southAfrica.module';
import IrfAfricaModule from './africa/irf.africa.module';
import IrfBeninModule from './benin/irf.benin.module';
import IrfUgandaModule from './uganda/irf.uganda.module';

import IrfRoutes from './irf.route';
import IrfService from './irf.service';

import IrfListController from './list/irfList.controller';

import IrfListService from './list/irfList.service';

import IrfNewListController from './newList/irfNewList.controller';
import CreateIrfModalController from './newList/createIrfModal.controller';

import IrfNewListService from './newList/irfNewList.service';

/* global angular */

export default angular.module('tinyhands.IRF', [IrfIndiaModule, IrfNepalModule, IrfSouthAfricaModule, IrfBangladeshModule, IrfMalawiModule, IrfAfricaModule, IrfBeninModule, IrfUgandaModule, sharedModule])
    .config(IrfRoutes)
    .controller('IrfListController', IrfListController)
    .service('IrfListService', IrfListService)
    .controller('IrfNewListController', IrfNewListController)
    .controller('CreateIrfModalController', CreateIrfModalController)
    .service('IrfNewListService', IrfNewListService)
    .service('IrfService', IrfService)
    .name;