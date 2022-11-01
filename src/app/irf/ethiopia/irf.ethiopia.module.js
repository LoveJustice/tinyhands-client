import IrfEthiopiaComponent from './ethiopia.component';

import IrfEthiopiaRoutes from './irf.ethiopia.route';

/* global angular */

export default angular.module('tinyhands.IRF.ethiopia', [])
    .config(IrfEthiopiaRoutes)
    .component('irfEthiopiaComponent', IrfEthiopiaComponent)
    .name;