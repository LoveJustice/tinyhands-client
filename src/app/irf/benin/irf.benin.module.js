import IrfBeninComponent from './benin.component';

import IrfBeninRoutes from './irf.benin.route';

/* global angular */

export default angular.module('tinyhands.IRF.benin', [])
    .config(IrfBeninRoutes)
    .component('irfBeninComponent', IrfBeninComponent)
    .name;