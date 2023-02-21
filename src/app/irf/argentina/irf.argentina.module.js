import IrfArgentinaComponent from './argentina.component';

import IrfArgentinaRoutes from './irf.argentina.route';

/* global angular */

export default angular.module('tinyhands.IRF.argentina', [])
    .config(IrfArgentinaRoutes)
    .component('irfArgentinaComponent', IrfArgentinaComponent)
    .name;