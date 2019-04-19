import CifIndiaComponent from './india.component';

import CifIndiaRoutes from './cif.india.route';

/* global angular */

export default angular.module('tinyhands.CIF.india', [])
    .config(CifIndiaRoutes)
    .component('cifIndiaComponent', CifIndiaComponent)
    .name;