import IrfUgandaComponent from './uganda.component';

import IrfUgandaRoutes from './irf.uganda.route';

/* global angular */

export default angular.module('tinyhands.IRF.uganda', [])
    .config(IrfUgandaRoutes)
    .component('irfUgandaComponent', IrfUgandaComponent)
    .name;