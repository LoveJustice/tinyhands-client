import IrfMozambiqueComponent from './mozambique.component';

import IrfMozambiqueRoutes from './irf.mozambique.route';

/* global angular */

export default angular.module('tinyhands.IRF.mozambique', [])
    .config(IrfMozambiqueRoutes)
    .component('irfMozambiqueComponent', IrfMozambiqueComponent)
    .name;