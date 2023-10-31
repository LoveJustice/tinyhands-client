import collectionIndicatorsTemplate from './collectionIndicators.html?url';
import './collectionIndicators.less';

function collectionIndicatorsRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('collectionIndicators', {
            url: '/collectionIndicators',
            templateUrl: collectionIndicatorsTemplate,
            controller: 'CollectionIndicatorsController',
            controllerAs: 'collectionIndicators',
        });
}

export default collectionIndicatorsRoutes;