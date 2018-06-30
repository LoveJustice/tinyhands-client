function IrfSouthAfricaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfSouthAfrica', {
            url: '/irf/southAfrica',
            component: 'irfSouthAfricaComponent',
        });
}

export default IrfSouthAfricaRoutes;