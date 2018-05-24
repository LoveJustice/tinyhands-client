import IrfIndiaComponent from './india.component';

import IrfIndiaRoutes from './irf.india.route';

export default angular.module('tinyhands.IRF.india', [])
    .config(IrfIndiaRoutes)
    .component('irfIndiaComponent', IrfIndiaComponent)
    .name;