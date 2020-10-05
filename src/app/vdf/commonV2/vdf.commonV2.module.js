import VdfCommonV2Component from './commonV2.component';

import VdfCommonV2Routes from './vdf.commonV2.route';

/* global angular */

export default angular.module('tinyhands.VDF.commonV2', [])
    .config(VdfCommonV2Routes)
    .component('vdfCommonV2Component', VdfCommonV2Component)
    .name;
