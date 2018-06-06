function IrfNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfNepal', {
            url: '/irf/nepal',
            component: 'irfNepalComponent',
        });
}

export default IrfNepalRoutes;