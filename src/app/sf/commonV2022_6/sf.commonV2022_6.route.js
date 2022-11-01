function SfCommonV2022_6Routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('sfNepal', {
            url: '/sf/commonV2022_6:?id&stationId&isViewing&formName&incidentId',
            component: 'sfCommon202206Component',
            params: {
                id: null,
            }
        });
}

export default SfCommonV2022_6Routes;
