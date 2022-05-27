import IrfEcuadorComponent from './ecuador.component';

import IrfEcuadorRoutes from './irf.ecuador.route';

/* global angular */

export default angular.module('tinyhands.IRF.ecuador', [])
    .config(IrfEcuadorRoutes)
    .component('irfEcuadorComponent', IrfEcuadorComponent)
    .name;