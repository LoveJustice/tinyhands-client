function IRFIndiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfIndia', {
            url: '/irf/india',
            component: 'irfIndiaComponent',
        });
}

export default IRFIndiaRoutes;