import address1ListTemplate from './address1/list/address1.html';
import address2ListTemplate from './address2/list/address2.html';
import './addresses.less';

function addressesRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('address1', {
            url: '/address1?deleteId?editId',
            templateUrl: address1ListTemplate,
            controller: 'Address1Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('address2', {
            url: '/address2?deleteId?editId',
            templateUrl: address2ListTemplate,
            controller: 'Address2Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default addressesRouteConfig;
