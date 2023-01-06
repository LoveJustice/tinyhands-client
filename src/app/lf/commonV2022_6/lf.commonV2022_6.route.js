function LfCommonV2022_6Routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('lfNepal', {
            url: '/lf/commonV2022_6:?id&stationId&isViewing&formName&incidentId',
            component: 'lfCommon202206Component',
            params: {
                id: null,
            }
        })
        .state('lfIndia', {
            url: '/lf/commonV2022_6:?id&stationId&isViewing&formName&incidentId',
            component: 'lfCommon202206Component',
            params: {
                id: null,
            }
        })
        .state('lfIndiaNetwork', {
            url: '/lf/commonV2022_6:?id&stationId&isViewing&formName&incidentId',
            component: 'lfCommon202206Component',
            params: {
                id: null,
            }
        });
}

export default LfCommonV2022_6Routes;
