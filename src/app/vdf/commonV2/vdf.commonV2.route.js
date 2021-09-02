function VdfCommonV2Routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('vdfBangladesh', {
            url: '/vdf/commonV2:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV2Component',
            params: {
                id: null
            }
        })
        .state('vdfIndia', {
            url: '/vdf/commonV2:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV2Component',
            params: {
                id: null
            }
        })
        .state('vdfGhana', {
            url: '/vdf/commonV2:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV2Component',
            params: {
                id: null
            }
        })
        .state('vdfTanzania', {
            url: '/vdf/commonV2:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV2Component',
            params: {
                id: null
            }
        });
}

export default VdfCommonV2Routes;
