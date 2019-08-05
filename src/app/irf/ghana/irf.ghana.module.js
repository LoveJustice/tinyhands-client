import IrfGhanaComponent from './ghana.component';

import IrfGhanaRoutes from './irf.ghana.route';

/* global angular */

export default angular.module('tinyhands.IRF.ghana', [])
    .config(IrfGhanaRoutes)
    .component('irfGhanaComponent', IrfGhanaComponent)
    .name;