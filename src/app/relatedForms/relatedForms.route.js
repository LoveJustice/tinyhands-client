import relatedFormsTemplate from './relatedForms.html?url';

function relatedFormsRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('relatedForms', {
            url: '/relatedForms:?stationId&formNumber',
            params: {
                stationId: { dynamic: true },
                formNumber: { dynamic: true }
              },
            templateUrl: relatedFormsTemplate,
            controller: 'RelatedFormsController',
            controllerAs: 'vm',
            data: {
            },
        });
}

export default relatedFormsRouteConfig;