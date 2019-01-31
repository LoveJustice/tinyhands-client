import CifNepalComponent from './nepal.component';

import CifNepalRoutes from './cif.nepal.route';

/* global angular */

export default angular.module('tinyhands.CIF.nepal', [])
    .config(CifNepalRoutes)
    .component('cifNepalComponent', CifNepalComponent)
    .name;