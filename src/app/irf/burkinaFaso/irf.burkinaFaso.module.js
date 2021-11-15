import IrfBurkinaFasoComponent from './burkinaFaso.component';

import IrfBurkinaFasoRoutes from './irf.burkinaFaso.route';

/* global angular */

export default angular.module('tinyhands.IRF.burkinaFaso', [])
    .config(IrfBurkinaFasoRoutes)
    .component('irfBurkinaFasoComponent', IrfBurkinaFasoComponent)
    .name;