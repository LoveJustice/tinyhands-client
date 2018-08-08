import IrfNepalComponent from './nepal.component';

import IrfNepalRoutes from './irf.nepal.route';

import NepalService from './nepal.service';

/* global angular */

export default angular.module('tinyhands.IRF.nepal', [])
    .config(IrfNepalRoutes)
    .component('irfNepalComponent', IrfNepalComponent)
    .service('NepalService', NepalService)
    .name;