import TinyHandsShared from '../shared/shared.module';

import VifRoutes from './vif.route';

import VifService from './form/vif.service';
import VifListService from './list/vifList.service';

import VifController from './form/vif.controller';
import VifListController from './list/vifList.controller';

export default angular.module('tinyhands.VIF', ['ui.router', 'ui.bootstrap', 'tinyhands.shared'])
  .config(VifRoutes)
    
  .service('VifListService', VifListService)
  .service('VifService', VifService)
  
  .controller('VIFController', VifController)
  .controller('VifListController', VifListController)