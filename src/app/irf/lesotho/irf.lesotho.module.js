import IrfLesothoComponent from './lesotho.component';

import IrfLesothoRoutes from './irf.lesotho.route';

/* global angular */

export default angular.module('tinyhands.IRF.lesotho', [])
    .config(IrfLesothoRoutes)
    .component('irfLesothoComponent', IrfLesothoComponent)
    .name;