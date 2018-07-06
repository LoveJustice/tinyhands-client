import IrfSouthAfricaComponent from './southAfrica.component';

import IrfSouthAfricaRoutes from './irf.southAfrica.route';

import SouthAfricaService from './southAfrica.service';

export default angular.module('tinyhands.IRF.southAfrica', [])
    .config(IrfSouthAfricaRoutes)
    .component('irfSouthAfricaComponent', IrfSouthAfricaComponent)
    .service('SouthAfricaService', SouthAfricaService)
    .name;