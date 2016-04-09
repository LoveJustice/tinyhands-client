import TinyHandsShared from '../shared/shared.module';

import VIFRoutes from './vif.route'

import VifService from './form/vif.service';
import VifListService from './list/vifList.service';

import VifController from './form/vif.controller';
import VifListController from './list/vifList.controller';

export default angular.module('tinyhands.VIF', ['ui.router', 'tinyhands.Shared'])
  .config(VIFRoutes)
  
  .service('VifListService', VifListService)
  .service('VifService', VifService)
  
  .controller('VifController', VifController)
  .controller('VifListController', VifListController)