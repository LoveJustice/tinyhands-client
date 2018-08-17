import IrfBangladeshComponent from './bangladesh.component';

import IrfBangladeshRoutes from './irf.bangladesh.route';

export default angular.module('tinyhands.IRF.bangladesh', [])
    .config(IrfBangladeshRoutes)
    .component('irfBangladeshComponent', IrfBangladeshComponent)
    .name;