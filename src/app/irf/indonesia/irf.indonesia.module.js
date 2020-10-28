import IrfIndonesiaComponent from './indonesia.component';

import IrfIndonesiaRoutes from './irf.indonesia.route';

/* global angular */

export default angular.module('tinyhands.IRF.indonesia', [])
    .config(IrfIndonesiaRoutes)
    .component('irfIndonesiaComponent', IrfIndonesiaComponent)
    .name;
