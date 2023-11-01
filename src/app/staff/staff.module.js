import sharedModule from '../shared/shared.module';

import staffRouteConfig from './staff.route';
import StaffService from './staff.service.js';
import StaffController from './staff.controller';

import StaffListController from './list/staffList.controller';

export default angular.module('tinyhands.Staff', [sharedModule])
    .config(staffRouteConfig)
    .controller('StaffListController', StaffListController)
    .controller('staffController', StaffController)
    .service('StaffService', StaffService)
    .name;
