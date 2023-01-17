import IrfNamibiaAirComponent from './namibiaAir.component';

import IrfNamibiaAirRoutes from './irf.NamibiaAir.route';

/* global angular */

export default angular.module('tinyhands.IRF.NamibiaAir', [])
    .config(IrfNamibiaAirRoutes)
    .component('irfNamibiaAirComponent', IrfNamibiaAirComponent)
    .name;