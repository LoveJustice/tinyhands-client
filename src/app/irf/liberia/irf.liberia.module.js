import IrfLiberiaComponent from './liberia.component';

import IrfLiberiaRoutes from './irf.liberia.route';

/* global angular */

export default angular.module('tinyhands.IRF.liberia', [])
    .config(IrfLiberiaRoutes)
    .component('irfLiberiaComponent', IrfLiberiaComponent)
    .name;