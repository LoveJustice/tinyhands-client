import IrfCambodiaComponent from './cambodia.component';

import IrfCambodiaRoutes from './irf.cambodia.route';

/* global angular */

export default angular.module('tinyhands.IRF.cambodia', [])
    .config(IrfCambodiaRoutes)
    .component('irfCambodiaComponent', IrfCambodiaComponent)
    .name;