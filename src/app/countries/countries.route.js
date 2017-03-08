function countriesRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('countries', {
            url: '/countries',
            templateUrl: 'app/countries/countries.html',
            controller: 'CountriesController',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_border_stations_edit']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default countriesRouteConfig;
