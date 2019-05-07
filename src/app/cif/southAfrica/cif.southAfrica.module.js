import CifSouthAfricaComponent from './southAfrica.component';

import CifSouthAfricaRoutes from './cif.southAfrica.route';

/* global angular */

export default angular.module('tinyhands.CIF.southAfrica', [])
    .config(CifSouthAfricaRoutes)
    .component('cifSouthAfricaComponent', CifSouthAfricaComponent)
    .name;