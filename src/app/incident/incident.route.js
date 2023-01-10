function IncidentRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('Incident', {
            url: '/incident/Incident:?id&stationId&countryId&isViewing&formName',
            component: 'incidentComponent',
            params: {
                id: null
            }
        });
}

export default IncidentRoutes;
