import IrfSouthAfricaComponent from './southAfrica.component';

import IrfSouthAfricaRoutes from './irf.southAfrica.route';

/* global angular */

export default angular.module('tinyhands.IRF.southAfrica', [])
    .config(IrfSouthAfricaRoutes)
    .component('irfSouthAfricaComponent', IrfSouthAfricaComponent)
    .name;