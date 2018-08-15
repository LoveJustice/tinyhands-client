import IrfNepalComponent from './nepal.component';

import IrfNepalRoutes from './irf.nepal.route';

/* global angular */

export default angular.module('tinyhands.IRF.nepal', [])
    .config(IrfNepalRoutes)
    .component('irfNepalComponent', IrfNepalComponent)
    .name;