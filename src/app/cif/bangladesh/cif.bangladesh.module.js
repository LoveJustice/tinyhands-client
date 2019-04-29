import CifBangladeshComponent from './bangladesh.component';

import CifBangladeshRoutes from './cif.bangladesh.route';

/* global angular */

export default angular.module('tinyhands.CIF.bangladesh', [])
    .config(CifBangladeshRoutes)
    .component('cifBangladeshComponent', CifBangladeshComponent)
    .name;