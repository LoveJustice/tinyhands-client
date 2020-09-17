function VdfCommonRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('vdfNepal', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfBangladesh', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfBenin', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfKenya', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfSouthAfrica', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        });
}

export default VdfCommonRoutes;
