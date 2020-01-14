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
        .state('vdfIndia', {
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
        .state('vdfUganda', {
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
        .state('vdfMalawi', {
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
        })
        .state('vdfTanzania', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfZimbabwe', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfIndiaNetwork', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        })
        .state('vdfRwanda', {
            url: '/vdf/common:?id&stationId&countryId&isViewing&formName',
            component: 'vdfCommonComponent',
            params: {
                id: null
            }
        });
}

export default VdfCommonRoutes;
