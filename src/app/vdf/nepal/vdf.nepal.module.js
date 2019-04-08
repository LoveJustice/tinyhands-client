import VdfNepalComponent from './nepal.component';

import VdfNepalRoutes from './vdf.nepal.route';

/* global angular */

export default angular.module('tinyhands.VDF.nepal', [])
    .config(VdfNepalRoutes)
    .component('vdfNepalComponent', VdfNepalComponent)
    .name;