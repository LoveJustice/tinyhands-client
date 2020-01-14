import indicatorsTemplate from './indicators.html';
import './indicators.less';

function indicatorsRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('indicators', {
            url: '/entryIndicators',
            templateUrl: indicatorsTemplate,
            controller: 'IndicatorsController',
            controllerAs: 'indicators',
        });
}

export default indicatorsRoutes;