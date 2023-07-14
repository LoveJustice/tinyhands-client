import mdfListTemplate from './list/mdfList.html';
import mdfPrTemplate from './mdfPr.html';
import './list/mdfList.less';
import './mdf.less';

function mdfRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('mdfList', {
            url: '/mdf-pr?search&countryIds',
            params: {
                search: { dynamic: true },
                countryIds: { dynamic: true }
            },
            templateUrl: mdfListTemplate,
            controller: 'MdfListController',
            controllerAs: 'mdfListCtrl',
        })
        .state('mdf-pr', {
            url: '/mdf-pr/:id?borderStationId&isViewing',
            templateUrl: mdfPrTemplate,
            controller: 'MdfPrController',
            controllerAs: 'mdfCtrl',
            params: {
                id: null
            }
        });
}

export default mdfRouteConfig;
