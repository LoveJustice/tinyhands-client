import IrfNamibiaComponent from './namibia.component';

import IrfNamibiaRoutes from './irf.namibia.route';

/* global angular */

export default angular.module('tinyhands.IRF.namibia', [])
    .config(IrfNamibiaRoutes)
    .component('irfNamibiaComponent', IrfNamibiaComponent)
    .name;