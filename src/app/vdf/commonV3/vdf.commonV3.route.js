function VdfCommonV3Routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('vdfIndiaNetwork', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfKenya', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
    	.state('vdfLesotho', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfMalawi', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfNepal', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfMozambique', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfNamibia', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfRwanda', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfSierraLeone', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfSouthAfrica', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        })
        .state('vdfZimbabwe', {
            url: '/vdf/commonV3:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonV3Component',
            params: {
                id: null
            }
        });
}

export default VdfCommonV3Routes;
