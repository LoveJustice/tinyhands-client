function VdfCommonV2Routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('vdfTanzania', {
            url: '/vdf/commonV2:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV2Component',
            params: {
                id: null
            }
        });
}

export default VdfCommonV2Routes;
