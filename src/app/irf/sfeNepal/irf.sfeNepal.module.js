import IrfSfeNepalComponent from './sfeNepal.component';

import IrfSfeNepalRoutes from './irf.sfeNepal.route';

/* global angular */

export default angular.module('tinyhands.IRF.sfeNepal', [])
    .config(IrfSfeNepalRoutes)
    .component('irfSfeNepalComponent', IrfSfeNepalComponent)
    .name;