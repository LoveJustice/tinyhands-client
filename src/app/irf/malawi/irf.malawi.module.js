import IrfMalawiComponent from './malawi.component';

import IrfMalawiRoutes from './irf.malawi.route';

/* global angular */

export default angular.module('tinyhands.IRF.malawi', [])
    .config(IrfMalawiRoutes)
    .component('irfMalawiComponent', IrfMalawiComponent)
    .name;