import CifAfricaRegionComponent from './africaRegion.component';

import CifAfricaRegionRoutes from './cif.africaRegion.route';

/* global angular */

export default angular.module('tinyhands.CIF.africaRegion', [])
    .config(CifAfricaRegionRoutes)
    .component('cifAfricaRegionComponent', CifAfricaRegionComponent)
    .name;