import IrfIndiaComponent from './india.component';

import IrfIndiaRoutes from './irf.india.route';

import IndiaService from './india.service';

export default angular.module('tinyhands.IRF.india', [])
    .config(IrfIndiaRoutes)
    .component('irfIndiaComponent', IrfIndiaComponent)
    .service('IndiaService', IndiaService)
    .name;