import staffListTemplate from './list/staffList.html?url';
import staffTemplate from './staff.html?url';

function staffRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('staff', {
            url: '/staff/?id&isViewing',
            templateUrl: staffTemplate,
            controller: 'staffController',
            controllerAs: 'vm',
            params: {
                id: null
            }
        })
        .state('staffList', {
	    	url: '/staffList?search',
		      templateUrl: staffListTemplate,
		      controller: 'StaffListController',
		      controllerAs: 'staffListCtrl',
	    });
}

export default staffRouteConfig;