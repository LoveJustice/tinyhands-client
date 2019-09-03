import IrfSierraLeoneComponent from './sierraLeone.component';

import IrfSierraLeoneRoutes from './irf.sierraLeone.route';

/* global angular */

export default angular.module('tinyhands.IRF.sierraLeone', [])
    .config(IrfSierraLeoneRoutes)
    .component('irfSierraLeoneComponent', IrfSierraLeoneComponent)
    .name;