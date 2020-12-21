import GospelVerificationCommonComponent from './common.component';

import GospelVerificationCommonRoutes from './gospelVerification.common.route';

/* global angular */

export default angular.module('tinyhands.gospelVerification.common', [])
    .config(GospelVerificationCommonRoutes)
    .component('gospelVerificationCommonComponent', GospelVerificationCommonComponent)
    .name;