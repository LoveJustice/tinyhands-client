import VdfCommonV3Component from './commonV3.component';

import VdfCommonV3Routes from './vdf.commonV3.route';

/* global angular */

export default angular.module('tinyhands.VDF.commonV3', [])
    .config(VdfCommonV3Routes)
    .component('vdfCommonV3Component', VdfCommonV3Component)
    .name;
