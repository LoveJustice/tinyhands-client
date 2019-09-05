import CifOsiComponent from './osi.component';

import CifOsiRoutes from './cif.osi.route';

/* global angular */

export default angular.module('tinyhands.CIF.osi', [])
    .config(CifOsiRoutes)
    .component('cifOsiComponent', CifOsiComponent)
    .name;
