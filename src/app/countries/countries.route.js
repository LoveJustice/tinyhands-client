import countryTemplate from './countries.html';

function countriesRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('countries', {
            url: '/countries',
            templateUrl: countryTemplate,
            controller: 'CountriesController',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
        });
}

export default countriesRouteConfig;
