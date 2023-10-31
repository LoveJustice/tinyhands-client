import stationDataTemplate from './stationData.html?url';
import './stationData.less';

function stationDataRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('stationData', {
            url: '/stationData',
            templateUrl: stationDataTemplate,
            controller: 'StationDataController',
            controllerAs: 'vm',
        });
}

export default stationDataRoutes;