import IrfPhilippinesComponent from './philippines.component';

import IrfPhilippinesRoutes from './irf.philippines.route';

/* global angular */

export default angular.module('tinyhands.IRF.philippines', [])
    .config(IrfPhilippinesRoutes)
    .component('irfPhilippinesComponent', IrfPhilippinesComponent)
    .name;