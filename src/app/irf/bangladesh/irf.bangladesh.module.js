import IrfBangladeshComponent from './bangladesh.component';

import IrfBangladeshRoutes from './irf.bangladesh.route';

import BangladeshService from './bangladesh.service';

export default angular.module('tinyhands.IRF.bangladesh', [])
    .config(IrfBangladeshRoutes)
    .component('irfBangladeshComponent', IrfBangladeshComponent)
    .service('BangladeshService', BangladeshService)
    .name;