import SfCommonV2022_6Component from './commonV2022_6.component';

import SfCommonV2022_6Routes from './sf.commonV2022_6.route';

/* global angular */

export default angular.module('tinyhands.SF.commonV2022_6', [])
    .config(SfCommonV2022_6Routes)
    .component('sfCommon202206Component', SfCommonV2022_6Component)
    .name;