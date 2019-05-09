import VdfCommonComponent from './common.component';

import VdfCommonRoutes from './vdf.common.route';

/* global angular */

export default angular.module('tinyhands.VDF.common', [])
    .config(VdfCommonRoutes)
    .component('vdfCommonComponent', VdfCommonComponent)
    .name;