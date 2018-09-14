import IrfIndiaComponent from './india.component';

import IrfIndiaRoutes from './irf.india.route';

/* global angular */

export default angular.module('tinyhands.IRF.india', [])
    .config(IrfIndiaRoutes)
    .component('irfIndiaComponent', IrfIndiaComponent)
    .name;