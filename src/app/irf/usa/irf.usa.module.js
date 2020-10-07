import IrfUsaComponent from './usa.component';

import IrfUsaRoutes from './irf.usa.route';

/* global angular */

export default angular.module('tinyhands.IRF.usa', [])
    .config(IrfUsaRoutes)
    .component('irfUsaComponent', IrfUsaComponent)
    .name;