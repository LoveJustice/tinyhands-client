import monthlyStationDataEntryTemplate from './monthlyStationDataEntry.html';
import './monthlyStationDataEntry.less';

function monthlyStationDataEntryRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('monthlyStationDataEntry', {
            url: '/monthlyStationDataEntry',
            templateUrl: monthlyStationDataEntryTemplate,
            controller: 'MonthlyStationDataEntryController',
            controllerAs: 'vm',
        });
}

export default monthlyStationDataEntryRoutes;