import IrfBurundiComponent from './burundi.component';

import IrfBurundiRoutes from './irf.burundi.route';

/* global angular */

export default angular.module('tinyhands.IRF.burundi', [])
    .config(IrfBurundiRoutes)
    .component('irfBurundiComponent', IrfBurundiComponent)
    .name;