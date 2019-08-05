import IrfTanzaniaComponent from './tanzania.component';

import IrfTanzaniaRoutes from './irf.tanzania.route';

/* global angular */

export default angular.module('tinyhands.IRF.tanzania', [])
    .config(IrfTanzaniaRoutes)
    .component('irfTanzaniaComponent', IrfTanzaniaComponent)
    .name;