function IrfBangladeshRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBangladesh', {
            url: '/irf/bangladesh',
            component: 'irfBangladeshComponent',
        });
}

export default IrfBangladeshRoutes;