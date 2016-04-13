import VIFRoutes from './vif.route';

import VifController from './form/vif.controller';
import VifListController from './list/vifList.controller';

import VifListService from './list/vifList.service';
import VifService from './form/vif.service';

export default angular.module('tinyhands.VIF', ['ui.router', 'tinyhands.Shared'])
  .config(VIFRoutes)

  .controller('VifController', VifController)
  .controller('VifListController', VifListController)

  .service('VifListService', VifListService)
  .service('VifService', VifService);