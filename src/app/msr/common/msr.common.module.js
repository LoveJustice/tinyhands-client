import MsrCommonComponent from './common.component';

import MsrCommonRoutes from './msr.common.route';

/* global angular */

export default angular.module('tinyhands.MSR.common', [])
    .config(MsrCommonRoutes)
    .component('msrCommonComponent', MsrCommonComponent)
    .name;