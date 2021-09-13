import VdfCommonV3Component from './commonV2021_6.component';

import VdfCommonV3Routes from './vdf.commonV2021_6.route';

/* global angular */

export default angular.module('tinyhands.VDF.commonV2021_6', [])
    .config(VdfCommonV3Routes)
    .component('vdfCommonV3Component', VdfCommonV3Component)
    .name;
