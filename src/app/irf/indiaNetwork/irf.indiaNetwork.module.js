import IrfIndiaNetworkComponent from './indiaNetwork.component';

import IrfIndiaNetworkRoutes from './irf.indiaNetwork.route';

/* global angular */

export default angular.module('tinyhands.IRF.indiaNetwork', [])
    .config(IrfIndiaNetworkRoutes)
    .component('irfIndiaNetworkComponent', IrfIndiaNetworkComponent)
    .name;
