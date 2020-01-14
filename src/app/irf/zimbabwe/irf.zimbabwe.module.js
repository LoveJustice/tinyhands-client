import IrfZimbabweComponent from './zimbabwe.component';

import IrfZimbabweRoutes from './irf.zimbabwe.route';

/* global angular */

export default angular.module('tinyhands.IRF.zimbabwe', [])
    .config(IrfZimbabweRoutes)
    .component('irfZimbabweComponent', IrfZimbabweComponent)
    .name;