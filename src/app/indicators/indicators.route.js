import indicatorsTemplate from './indicators.html?url';
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