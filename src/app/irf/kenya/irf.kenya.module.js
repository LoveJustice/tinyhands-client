import IrfKenyaComponent from './kenya.component';

import IrfKenyaRoutes from './irf.kenya.route';

/* global angular */

export default angular.module('tinyhands.IRF.kenya', [])
    .config(IrfKenyaRoutes)
    .component('irfKenyaComponent', IrfKenyaComponent)
    .name;