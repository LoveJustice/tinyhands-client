import locationStaffTemplate from './locationStaff.html';
import './locationStaff.less';

function locationStaffRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('locationStaff', {
            url: '/locationStaff',
            templateUrl: locationStaffTemplate,
            controller: 'LocationStaffController',
            controllerAs: 'vm',
        });
}

export default locationStaffRoutes;