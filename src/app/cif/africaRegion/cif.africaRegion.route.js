function CifAfricaRegionRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifBenin', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifGhana', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifKenya', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifMalawi', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifSierraLeone', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifSouthAfrica', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifTanzania', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        .state('cifUganda', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        }).state('cifZimbabwe', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        }).state('cifNamibia', {
            url: '/cif/africaRegion:?id&stationId&countryId&isViewing&formName',
            component: 'cifAfricaRegionComponent',
            params: {
                id: null
            }
        })
        
        ;
}

export default CifAfricaRegionRoutes;
