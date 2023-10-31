import address1ListTemplate from './address1/list/address1.html?url';
import address2ListTemplate from './address2/list/address2.html?url';
import './addresses.less';

function addressesRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('address1', {
            url: '/address1?deleteId?editId',
            params: {
                deleteId: { dynamic: true },
                editId: { dynamic: true },
            },
            templateUrl: address1ListTemplate,
            controller: 'Address1Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
        })
        .state('address2', {
            url: '/address2?deleteId?editId',
            params: {
                deleteId: { dynamic: true },
                editId: { dynamic: true },
            },
            templateUrl: address2ListTemplate,
            controller: 'Address2Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
        });
}

export default addressesRouteConfig;
