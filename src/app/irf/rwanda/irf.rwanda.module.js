import IrfRwandaComponent from './rwanda.component';

import IrfRwandaRoutes from './irf.rwanda.route';

/* global angular */

export default angular.module('tinyhands.IRF.rwanda', [])
    .config(IrfRwandaRoutes)
    .component('irfRwandaComponent', IrfRwandaComponent)
    .name;