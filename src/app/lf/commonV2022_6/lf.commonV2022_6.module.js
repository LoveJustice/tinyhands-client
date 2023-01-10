import LfCommonV2022_6Component from './commonV2022_6.component';

import LfCommonV2022_6Routes from './lf.commonV2022_6.route';

/* global angular */

export default angular.module('tinyhands.LF.commonV2022_6', [])
    .config(LfCommonV2022_6Routes)
    .component('lfCommon202206Component', LfCommonV2022_6Component)
    .name;