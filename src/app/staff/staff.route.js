import staffListTemplate from './list/staffList.html';
import staffTemplate from './staff.html';

function staffRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('staff', {
            url: '/staff/?id&isViewing&tabName',
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