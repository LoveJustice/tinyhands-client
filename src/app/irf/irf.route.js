import irfListTemplate from './list/irfList.html';
import './list/irfList.less';

function IrfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfList', {
            url: '/irf?search',
            params: {
                search: {
                    dynamic: true
                }
            },
            templateUrl: irfListTemplate,
            controller: 'IrfListController',
            controllerAs: 'irfListCtrl',
        });
}

export default IrfRoutes;