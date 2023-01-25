import PvfCommonV2022_6Component from './commonV2022_6.component';

import PvfCommonV2022_6Routes from './pvf.commonV2022_6.route';

/* global angular */

export default angular.module('tinyhands.PVF.commonV2022_6', [])
    .config(PvfCommonV2022_6Routes)
    .component('pvfCommon202206Component', PvfCommonV2022_6Component)
    .name;
