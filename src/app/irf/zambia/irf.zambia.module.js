import IrfZambiaComponent from './zambia.component';

import IrfZambiaRoutes from './irf.zambia.route';

/* global angular */

export default angular.module('tinyhands.IRF.zambia', [])
    .config(IrfZambiaRoutes)
    .component('irfZambiaComponent', IrfZambiaComponent)
    .name;