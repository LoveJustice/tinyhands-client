import IrfAfricaComponent from './africa.component';

import IrfAfricaRoutes from './irf.africa.route';

/* global angular */

export default angular.module('tinyhands.IRF.africa', [])
    .config(IrfAfricaRoutes)
    .component('irfAfricaComponent', IrfAfricaComponent)
    .name;